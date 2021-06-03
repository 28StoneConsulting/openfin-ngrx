import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { OpenfinNgrxService } from "./openfin-ngrx.service";

export type ActionReceiver = {
  type: "window" | "route" | "parent";
  name?: string;
};

export type RoutingInfo = {
  receivers: ActionReceiver | ActionReceiver[];
  remoteOnly?: boolean;
};

export interface RoutedAction extends Action {
  routing?: RoutingInfo;
}

@Injectable({
  providedIn: "root",
})
export class OpenfinNgrxMetareducerService {
  constructor(private readonly openfinNgrxService: OpenfinNgrxService) {}

  processStoreAction(action: RoutedAction) {
    if (!action.routing) {
      return true;
    }

    if (this.openfinNgrxService.isOpenFinEnvironment()) {
      const remoteAction = { ...action, routing: undefined };

      if (Array.isArray(action.routing.receivers)) {
        action.routing.receivers.forEach((receiver) =>
          this.processReceiver(receiver, remoteAction)
        );
      } else {
        this.processReceiver(action.routing.receivers, remoteAction);
      }
    }

    return !action.routing.remoteOnly;
  }

  private processReceiver(receiver: ActionReceiver, action: RoutedAction) {
    switch (receiver.type) {
      case "parent":
        this.openfinNgrxService.dispatchToParent(action);
        break;
      case "window":
        this.openfinNgrxService.dispatchToWindow(action, receiver.name);
        break;
      case "route":
        this.openfinNgrxService.dispatchToRoute(action, receiver.name);
        break;
      default:
        throw Error(`Unsupported receiver type: ${receiver.type}`);
    }
  }
}
