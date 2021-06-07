import { ActionReceiver } from './openfin-ngrx-metareducer.service';

export function routingPayloadProps<T>(receivers: ActionReceiver | ActionReceiver[], remoteOnly = false) {
  return (payload?: T) =>
    payload ? { payload, routing: { receivers, remoteOnly } } : { routing: { receivers, remoteOnly } };
}

export function routingProps<T>(receivers: ActionReceiver | ActionReceiver[], remoteOnly = false) {
  return (props?: T) =>
    props ? { ...props, routing: { receivers, remoteOnly } } : { routing: { receivers, remoteOnly } };
}
