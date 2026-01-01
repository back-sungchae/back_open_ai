import express from "express";
import {
  create_task_controller,
  delete_task_controller,
  get_task_controller,
  list_tasks_controller,
  set_task_status_controller,
  update_task_controller,
} from "../modules/task/task.controller.js";

const router = express.Router();

router.get("/", list_tasks_controller);
router.get("/:id", get_task_controller);
router.post("/", create_task_controller);
router.patch("/:id", update_task_controller);
router.patch("/:id/status", set_task_status_controller);
router.delete("/:id", delete_task_controller);

export default router;
