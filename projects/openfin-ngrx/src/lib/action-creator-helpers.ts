import { ActionReceiver } from "./openfin-ngrx-metareducer.service";

export function routingProps<T>(
  receivers: ActionReceiver | ActionReceiver[],
  remoteOnly = false
) {
  return (payload?: T) =>
    payload
      ? { payload, routing: { receivers, remoteOnly } }
      : { routing: { receivers, remoteOnly } };
}
