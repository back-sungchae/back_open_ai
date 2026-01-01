import { event_bus } from "./streams.js";

export function subscribe(stream, handler, options = {}) {
  const { once = false, signal } = options;
  const wrapped = (envelope) => handler(envelope);

  if (once) event_bus.once(stream, wrapped);
  else event_bus.on(stream, wrapped);

  const unsubscribe = () => {
    event_bus.off(stream, wrapped);
  };

  if (signal) {
    if (signal.aborted) {
      unsubscribe();
    } else {
      signal.addEventListener("abort", unsubscribe, { once: true });
    }
  }

  return unsubscribe;
}

export function subscribe_all(handler, options = {}) {
  return subscribe("*", handler, options);
}
