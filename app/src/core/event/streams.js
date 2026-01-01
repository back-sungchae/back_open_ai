import { EventEmitter } from "events";

export const STREAMS = Object.freeze({
  SYSTEM: "system",
  REQUEST: "request",
  RESPONSE: "response",
  ERROR: "error",
  AUDIT: "audit",
});

export function create_event_bus(options = {}) {
  const emitter = new EventEmitter();
  const max_listeners =
    options.max_listeners === undefined ? 50 : options.max_listeners;
  emitter.setMaxListeners(max_listeners);
  return emitter;
}

export const event_bus = create_event_bus();
