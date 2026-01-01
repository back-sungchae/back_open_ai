import { TASK_STATUS } from "./task.state.js";

const tasks = new Map();
let seq = 1;

export function create_task({ title, input, status = TASK_STATUS.PENDING }) {
  const id = String(seq++);
  const now = Date.now();
  const task = {
    id,
    title,
    input,
    status,
    created_at: now,
    updated_at: now,
  };

  tasks.set(id, task);
  return task;
}

export function list_tasks() {
  return Array.from(tasks.values());
}

export function get_task(id) {
  return tasks.get(String(id)) || null;
}

export function update_task(id, patch) {
  const task = get_task(id);
  if (!task) return null;

  const next = {
    ...task,
    ...patch,
    updated_at: Date.now(),
  };
  tasks.set(task.id, next);
  return next;
}

export function delete_task(id) {
  const task = get_task(id);
  if (!task) return null;
  tasks.delete(task.id);
  return task;
}
