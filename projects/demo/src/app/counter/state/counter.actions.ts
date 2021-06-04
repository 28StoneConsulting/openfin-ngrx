import { createAction } from "@ngrx/store";
import { ActionReceiver, RoutingInfo, routingProps } from "openfin-ngrx";

const routingFunction = (
  receivers?: ActionReceiver | ActionReceiver[],
  remoteOnly?: boolean
): { routing?: RoutingInfo } =>
  receivers ? { routing: { receivers, remoteOnly } } : {};

export const increment = createAction(
  "[Counter Component] Increment",
  routingFunction
);

export const decrement = createAction(
  "[Counter Component] Decrement",
  routingFunction
);

export const incrementParent = createAction(
  "[Counter Component] Increment",
  routingProps({ type: "parent" }, true)
);

export const decrementParent = createAction(
  "[Counter Component] Decrement",
  routingProps({ type: "parent" }, true)
);

export const reset = createAction("[Counter Component] Reset", routingFunction);
