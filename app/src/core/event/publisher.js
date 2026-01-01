import { event_bus } from "./streams.js";

export function publish(stream, payload, meta = {}) {
  const envelope = {
    stream,
    payload,
    meta,
    ts: Date.now(),
  };

  event_bus.emit(stream, envelope);
  event_bus.emit("*", envelope);
}
