import {
  create_task as create_task_model,
  delete_task as delete_task_model,
  get_task,
  list_tasks as list_tasks_model,
  update_task as update_task_model,
} from "./task.model.js";
import { can_transition, is_task_status } from "./task.state.js";
import { publish } from "../../core/event/publisher.js";
import { TASK_EVENTS, TASK_STREAM } from "./task.events.js";

function require_title(title) {
  if (!title || String(title).trim() === "") {
    throw new Error("title is required");
  }
}

export function create_task({ title, input }) {
  require_title(title);
  const task = create_task_model({ title: String(title).trim(), input });

  publish(TASK_STREAM, { task }, { event: TASK_EVENTS.CREATED });
  publish(TASK_EVENTS.CREATED, { task });

  return task;
}

export function list_tasks() {
  return list_tasks_model();
}

export function get_task_by_id(id) {
  return get_task(id);
}

export function update_task(id, patch) {
  const next = {};
  if (patch.title !== undefined) {
    require_title(patch.title);
    next.title = String(patch.title).trim();
  }
  if (patch.input !== undefined) {
    next.input = patch.input;
  }

  const task = update_task_model(id, next);
  if (!task) return null;

  publish(TASK_STREAM, { task }, { event: TASK_EVENTS.UPDATED });
  publish(TASK_EVENTS.UPDATED, { task });

  return task;
}

export function set_task_status(id, status) {
  if (!is_task_status(status)) {
    throw new Error(`invalid status: ${status}`);
  }

  const current = get_task(id);
  if (!current) return null;
  if (!can_transition(current.status, status)) {
    throw new Error(`invalid transition: ${current.status} -> ${status}`);
  }

  const task = update_task_model(id, { status });

  publish(TASK_STREAM, { task }, { event: TASK_EVENTS.STATUS_CHANGED });
  publish(TASK_EVENTS.STATUS_CHANGED, { task });

  return task;
}

export function delete_task(id) {
  const task = delete_task_model(id);
  if (!task) return null;

  publish(TASK_STREAM, { task }, { event: TASK_EVENTS.DELETED });
  publish(TASK_EVENTS.DELETED, { task });

  return task;
}
