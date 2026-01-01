import { subscribe } from "../../core/event/consumer.js";
import logger from "../../core/logger/logger.js";
import { TASK_EVENTS } from "../task/task.events.js";
import { set_task_status } from "../task/task.service.js";

export function start_state_decision_consumer() {
  subscribe(TASK_EVENTS.RISK_ANALYZED, async ({ payload }) => {
    const { task_id, score, risk_level } = payload?.analysis || {};
    if (!task_id) return;

    // 서버 규칙
    let resolvedScore = score;
    if (!Number.isFinite(resolvedScore)) {
      resolvedScore = risk_level === "HIGH" ? 8 : risk_level === "MEDIUM" ? 5 : 2;
    }
    const nextStatus = resolvedScore >= 5 ? "failed" : "success";

    await set_task_status(task_id, nextStatus);

    logger.info("task_status_decided", {
      task_id,
      score,
      status: nextStatus,
    });
  });
}
