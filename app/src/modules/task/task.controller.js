import {
  create_task,
  delete_task,
  get_task_by_id,
  list_tasks,
  set_task_status,
  update_task,
} from "./task.service.js";

export function list_tasks_controller(req, res, next) {
  try {
    res.json({ items: list_tasks() });
  } catch (err) {
    next(err);
  }
}

export function get_task_controller(req, res, next) {
  try {
    const task = get_task_by_id(req.params.id);
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export function create_task_controller(req, res, next) {
  try {
    const task = create_task(req.body || {});
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export function update_task_controller(req, res, next) {
  try {
    const task = update_task(req.params.id, req.body || {});
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export function set_task_status_controller(req, res, next) {
  try {
    const { status } = req.body || {};
    const task = set_task_status(req.params.id, status);
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export function delete_task_controller(req, res, next) {
  try {
    const task = delete_task(req.params.id);
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json({ task });
  } catch (err) {
    next(err);
  }
}
