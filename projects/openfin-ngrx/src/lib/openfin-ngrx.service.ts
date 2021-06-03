import { Injectable, Injector, NgZone } from "@angular/core";
import { WindowCommunicationService } from "./window-communication.service";
import { Action, select, Store } from "@ngrx/store";
import { merge, Observable } from "rxjs";
import { filter, map, share } from "rxjs/operators";
import {
  getSelectorByHash,
  getSelectorHash,
  selectorFunction,
} from "./selector-manager";
import { MessageWithReplay } from "../models/message";

const enum NgrxCommand {
  dispatch = "dispatch",
  select = "select",
}

interface SelectorPayload {
  hash: any;
  props?: any;
}

interface EvaluationRequest {
  command: NgrxCommand;
  payload: any;
}

interface SelectorEvaluationRequest {
  command: NgrxCommand;
  payload: SelectorPayload;
}

@Injectable({
  providedIn: "root",
})
export class OpenfinNgrxService {
  store: Store;

  constructor(
    private readonly injector: Injector,
    private readonly ngZone: NgZone,
    private readonly windowCommunicationService: WindowCommunicationService
  ) {
    // this tricky injection is needed to avoid angular circle dependency validation when this service is used from Store metareducer
    setTimeout(() => {
      this.store = this.injector.get(Store);
    });

    const myMessages = merge<MessageWithReplay<EvaluationRequest>>(
      this.windowCommunicationService.listenToParentChannel(),
      this.windowCommunicationService.listenToRouteChannel(),
      this.windowCommunicationService.listenToWindowNameChannel()
    ).pipe(share());

    myMessages
      .pipe(
        map((message) => message.data),
        filter((data) => data.command === NgrxCommand.dispatch),
        map((data) => data.payload)
      )
      .subscribe((action: Action) => {
        ngZone.run(() => this.store.dispatch(action));
      });

    this.windowCommunicationService
      .listenToSubscriptionRequest<SelectorEvaluationRequest>()
      .pipe(filter((message) => message.data.command === NgrxCommand.select))
      .subscribe((message) => {
        const selector = getSelectorByHash(message.data.payload.hash);
        message.response(
          this.store.pipe(select(selector, message.data.payload.props))
        );
      });
  }

  dispatchToParent(action: Action): void {
    this.windowCommunicationService.sendToParent({
      command: NgrxCommand.dispatch,
      payload: action,
    });
  }

  dispatchToWindow(action: Action, windowName: string): void {
    this.windowCommunicationService.sendToWindow<EvaluationRequest, void>(
      windowName,
      {
        command: NgrxCommand.dispatch,
        payload: action,
      }
    );
  }

  dispatchToRoute(action: Action, route: string): void {
    this.windowCommunicationService.sendToRoute(route, {
      command: NgrxCommand.dispatch,
      payload: action,
    });
  }

  selectFromWindow<T>(
    windowName: string,
    selector: selectorFunction
  ): Observable<T> {
    return this.selectFromWindowInternal<T>(
      (data: EvaluationRequest) =>
        this.windowCommunicationService.subscribeToWindowByName(
          windowName,
          data
        ),
      selector
    );
  }

  selectFromParent<T>(selector: selectorFunction, props?): Observable<T> {
    return this.selectFromWindowInternal<T>(
      (data: EvaluationRequest) =>
        this.windowCommunicationService.subscribeToParent(data),
      selector,
      props
    );
  }

  isOpenFinEnvironment() {
    return !!window.fin;
  }

  private selectFromWindowInternal<T>(
    communicationFunction: (data: EvaluationRequest) => Observable<T>,
    selector: selectorFunction,
    props?
  ): Observable<T> {
    const hash = getSelectorHash(selector);
    const srcObservable = communicationFunction({
      command: NgrxCommand.select,
      payload: { hash, props },
    });
    const insideZone = new Observable<T>((subscriber) => {
      const subscribe = srcObservable.subscribe(
        (data) => this.ngZone.run(() => subscriber.next(data)),
        (error) => this.ngZone.run(() => subscriber.error(error)),
        () => this.ngZone.run(() => subscriber.complete())
      );
      return () => subscribe.unsubscribe();
    });
    return insideZone;
  }
}
