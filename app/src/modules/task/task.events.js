// Phase 1: CRUD-oriented events. Phase 2 can introduce domain-level events.
export const TASK_STREAM = "task";

export const TASK_EVENTS = Object.freeze({
  CREATED: "task.created",
  UPDATED: "task.updated",
  STATUS_CHANGED: "task.status_changed",
  DELETED: "task.deleted",
  RISK_ANALYZED: "task.risk_analyzed",
});
