import { ActionReceiver, RoutingInfo } from './openfin-ngrx-metareducer.service';

export function routingPayloadProps<T>(receivers: ActionReceiver | ActionReceiver[], remoteOnly = false) {
  return (payload?: T): { payload: T; routing: RoutingInfo } => ({ payload, routing: { receivers, remoteOnly } });
}

export function routingProps<T>(receivers: ActionReceiver | ActionReceiver[], remoteOnly = false) {
  return (props?: T): T & { routing: RoutingInfo } => ({ ...props, routing: { receivers, remoteOnly } });
}
