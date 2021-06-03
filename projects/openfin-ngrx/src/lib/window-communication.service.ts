import { Injectable } from "@angular/core";
import { from, fromEvent, Observable, Subject, Subscription } from "rxjs";
import {
  filter,
  first,
  map,
  pluck,
  share,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import { NavigationEnd, Router } from "@angular/router";
import { communicationChannel } from "./communication-channels";
import { MessageWithReplay, Message } from "../models/message";
import { SubscriptionCommand } from "./subscription-command";
import { _Window } from "openfin/_v2/api/window/window";
import { Identity } from "openfin/_v2/shapes/Identity";

interface SubscriptionRequest<T> {
  data: T;
  messageId: number;
  senderIdentity: Identity;
}

@Injectable()
export class WindowCommunicationService {
  private static messagesCounter = 0;
  private replay: Observable<any>;
  private parentWindow: _Window;
  private window: _Window;
  subscription: Observable<{}>;

  constructor(private router: Router) {
    this.window = fin.Window.getCurrentSync();

    fin.Window.getCurrentSync()
      .getParentWindow()
      .then((parent) => (this.parentWindow = parent));
    this.replay = this.listenToChannel(communicationChannel.replay).pipe(
      share()
    );

    this.subscription = this.listenToChannel(
      communicationChannel.subscription
    ).pipe(share());
  }

  generateMessageId(): string {
    return `${fin.me.uuid}_${
      fin.me.name
    }_${WindowCommunicationService.messagesCounter++}`;
  }

  listenToParentChannel<T>(): Observable<MessageWithReplay<T>> {
    return this.listenToChannel<Message>(communicationChannel.parent).pipe(
      map<Message, MessageWithReplay<T>>(this.addReplayToMessage)
    );
  }

  listenToWindowNameChannel<T>(): Observable<MessageWithReplay<T>> {
    return this.listenToChannel<Message>(communicationChannel.window).pipe(
      map<Message, MessageWithReplay<T>>(this.addReplayToMessage)
    );
  }

  listenToRouteChannel<T>(): Observable<{ data: T }> {
    return this.listenToChannel(communicationChannel.route).pipe(
      withLatestFrom(
        this.getWindowRoute(),
        (message: { route: string; data: T }, myRoute) => ({
          message,
          myRoute,
        })
      ),
      filter(({ myRoute, message }) => myRoute.startsWith(message.route)),
      map(({ message }) => ({ data: message.data }))
    );
  }

  sendToRoute<T>(route: string, data: T): void {
    fin.InterApplicationBus.publish(communicationChannel.route, {
      data,
      route,
    });
  }

  sendToParent<T, R>(data: T): Observable<R> {
    const messageId = this.generateMessageId();
    fin.InterApplicationBus.send(
      this.parentWindow.identity,
      communicationChannel.parent,
      {
        data,
        senderIdentity: this.window.identity,
        messageId,
      }
    );
    return this.getReplayByMessageId<R>(messageId);
  }

  sendToWindow<T, R>(windowName: string, data: T): Observable<R> {
    const messageId = this.generateMessageId();
    this.sendToWindowChannel(
      communicationChannel.window,
      { uuid: fin.me.uuid, name: windowName },
      {
        data,
        senderIdentity: this.window.identity,
        messageId,
      }
    );
    return this.getReplayByMessageId<R>(messageId);
  }

  listenToSubscriptionRequest<T>() {
    return this.subscription.pipe(
      map((message: SubscriptionRequest<T>) => {
        return {
          data: message.data,
          response: (observable: Observable<any>) => {
            const channel =
              communicationChannel.subscription + message.messageId;
            const cleanup = this.onWindowClose(
              fin.Window.wrapSync(message.senderIdentity)
            );
            this.sendObservableOnChannel(
              channel,
              cleanup,
              observable,
              message.senderIdentity
            );
            this.sendToWindowChannel(channel, message.senderIdentity, {
              type: SubscriptionCommand.listening,
            });
          },
        };
      }),
      share()
    );
  }

  private sendObservableOnChannel(
    channel: string,
    cleanup: Observable<void>,
    srcObservable: Observable<any>,
    windowIdentity: Identity
  ) {
    let subscription: Subscription;
    this.listenToChannel(channel)
      .pipe(takeUntil(cleanup))
      .subscribe((command: { type: SubscriptionCommand }) => {
        if (command.type === SubscriptionCommand.subscribe) {
          subscription = srcObservable.pipe(takeUntil(cleanup)).subscribe(
            (data) =>
              this.sendToWindowChannel(channel, windowIdentity, {
                type: SubscriptionCommand.next,
                data,
              }),
            (error) =>
              this.sendToWindowChannel(channel, windowIdentity, {
                type: SubscriptionCommand.error,
                data: error,
              }),
            () =>
              this.sendToWindowChannel(channel, windowIdentity, {
                type: SubscriptionCommand.complete,
              })
          );
        } else if (command.type === SubscriptionCommand.unsubscribe) {
          subscription.unsubscribe();
        }
      });
  }

  subscribeToParent<T, R>(data: T): Observable<R> {
    return this.subscribeToWindow<T, R>(this.parentWindow, data);
  }

  subscribeToWindowByName<T, R>(name: string, data: T): Observable<R> {
    return this.subscribeToWindow<T, R>(
      fin.Window.wrapSync({ uuid: fin.me.uuid, name }),
      data
    );
  }

  private subscribeToWindow<T, R>(window: _Window, data: T): Observable<R> {
    const messageId = this.generateMessageId();
    const channel = communicationChannel.subscription + messageId;
    const waitForWindowToListen = this.waitForWindowToListen(channel);

    fin.InterApplicationBus.send(
      window.identity,
      communicationChannel.subscription,
      {
        data,
        messageId,
        senderIdentity: this.window.identity,
      }
    );

    return from(waitForWindowToListen).pipe(
      switchMap(this.channelSubscriptionToObservable<R>(window, channel)),
      share()
    );
  }

  private channelSubscriptionToObservable<T>(
    window: _Window,
    channel: string
  ): () => Observable<T> {
    return () =>
      new Observable((subscriber) => {
        const cleanup = new Subject();
        this.onWindowClose(window)
          .pipe(takeUntil(cleanup))
          .subscribe(() => {
            subscriber.complete();
            cleanup.next();
          });

        this.listenToChannel(channel)
          .pipe(takeUntil(cleanup))
          .subscribe(
            (messageData: { type: SubscriptionCommand; data: any }) => {
              if (messageData.type === SubscriptionCommand.complete) {
                subscriber.complete();
                cleanup.next();
              } else if (messageData.type === SubscriptionCommand.next) {
                subscriber.next(messageData.data);
              } else if (messageData.type === SubscriptionCommand.error) {
                subscriber.error(messageData.data);
              }
            }
          );

        this.sendToWindowChannel(channel, window.identity, {
          type: SubscriptionCommand.subscribe,
        });

        return () => {
          this.sendToWindowChannel(channel, window.identity, {
            type: SubscriptionCommand.unsubscribe,
          });

          cleanup.next();
        };
      });
  }

  private addReplayToMessage<T>(message: Message): MessageWithReplay<T> {
    return {
      data: message.data,
      replay: (replayMessage: any) =>
        this.sendToWindowChannel(
          communicationChannel.replay,
          { uuid: fin.me.uuid, name: message.senderName },
          {
            data: replayMessage,
            messageId: message.messageId,
          }
        ),
    };
  }

  private getWindowRoute(): Observable<string> {
    return this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.url)
    );
  }

  private getReplayByMessageId<T>(messageId): Observable<T> {
    return this.replay.pipe(
      filter((message) => message.messageId === messageId),
      pluck("data"),
      take(1)
    );
  }

  private sendToWindowChannel(channel: string, identity: Identity, data): void {
    fin.InterApplicationBus.send(identity, channel, data);
  }

  private listenToChannel<T>(channelName: string): Observable<T> {
    return new Observable<T>((observer) => {
      const listener = (data) => {
        observer.next(data);
      };

      fin.InterApplicationBus.subscribe(
        { uuid: fin.me.uuid },
        channelName,
        listener
      ).catch((error) => observer.error(error));

      return () => {
        fin.InterApplicationBus.unsubscribe(
          { uuid: fin.me.uuid },
          channelName,
          listener
        );
      };
    });
  }

  private onWindowClose(window: _Window): Observable<any> {
    return fromEvent(window, "closed").pipe(first());
  }

  private waitForWindowToListen(channel: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const listener = (data: { type: string }) => {
        data.type === SubscriptionCommand.listening
          ? resolve()
          : // tslint:disable-next-line:max-line-length
            reject(
              `The first message on channel is supposed to be:{type:${
                SubscriptionCommand.listening
              }} but the message received was: ${JSON.stringify(
                data
              )}  please open issue in our github repository`
            );

        fin.InterApplicationBus.unsubscribe(
          { uuid: fin.me.uuid },
          channel,
          listener
        );
      };

      fin.InterApplicationBus.subscribe(
        { uuid: fin.me.uuid },
        channel,
        listener
      ).catch((error) => reject(error));
    });
  }
}
