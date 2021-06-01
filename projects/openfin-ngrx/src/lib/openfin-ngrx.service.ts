import { ApplicationRef, Injectable, NgZone } from "@angular/core";
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

const enum ngrxCommand {
  dispatch,
  select,
}

interface SelectorPayload {
  hash: any;
  props?: any;
}

interface EvaluationRequest {
  command: ngrxCommand;
  payload: any;
}

interface SelectorEvaluationRequest {
  command: ngrxCommand;
  payload: SelectorPayload;
}

@Injectable()
export class OpenfinNgrxService {
  constructor(
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private store: Store<any>,
    private windowCommunicationService: WindowCommunicationService
  ) {
    const myMessages = merge<MessageWithReplay<EvaluationRequest>>(
      this.windowCommunicationService.listenToParentChannel(),
      this.windowCommunicationService.listenToRouteChannel(),
      this.windowCommunicationService.listenToIdChannel()
    ).pipe(share());
    myMessages
      .pipe(
        map((message) => message.data),
        filter((data) => data.command === ngrxCommand.dispatch),
        map((data) => data.payload)
      )
      .subscribe((action: Action) => {
        ngZone.run(() => this.store.dispatch(action));
      });
    this.windowCommunicationService
      .listenToSubscriptionRequest<SelectorEvaluationRequest>()
      .pipe(filter((message) => message.data.command === ngrxCommand.select))
      .subscribe((message) => {
        const selector = getSelectorByHash(message.data.payload.hash);
        message.response(
          this.store.pipe(select(selector, message.data.payload.props))
        );
      });
  }

  dispatchToParent(action: Action): void {
    this.windowCommunicationService.sendToParent({
      command: ngrxCommand.dispatch,
      payload: action,
    });
  }

  dispatchToId(action: Action, id: number): void {
    this.windowCommunicationService.sendToId<EvaluationRequest, void>(id, {
      command: ngrxCommand.dispatch,
      payload: action,
    });
  }

  dispatchToRoute(action: Action, route: string): void {
    this.windowCommunicationService.sendToRoute(route, {
      command: ngrxCommand.dispatch,
      payload: action,
    });
  }

  selectFromId<T>(id: number, selector: selectorFunction): Observable<T> {
    return this.selectFromWindow<T>(
      (data: EvaluationRequest) =>
        this.windowCommunicationService.subscribeToWindowById(id, data),
      selector
    );
  }

  selectFromParent<T>(selector: selectorFunction, props?): Observable<T> {
    return this.selectFromWindow<T>(
      (data: EvaluationRequest) =>
        this.windowCommunicationService.subscribeToParent(data),
      selector,
      props
    );
  }

  private selectFromWindow<T>(
    communicationFunction: (data: EvaluationRequest) => Observable<T>,
    selector: selectorFunction,
    props?
  ): Observable<T> {
    const hash = getSelectorHash(selector);
    const srcObservable = communicationFunction({
      command: ngrxCommand.select,
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
