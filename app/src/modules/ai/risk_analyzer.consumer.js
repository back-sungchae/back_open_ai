import logger from "../../core/logger/logger.js";
import { subscribe } from "../../core/event/consumer.js";
import { TASK_EVENTS } from "../task/task.events.js";
import { analyze_risk_with_ai } from "./openai.client.js";

export function start_risk_analyzer() {
  return subscribe(TASK_EVENTS.CREATED, async ({ payload }) => {
    const task = payload?.task;
    if (!task) return;

    try {
      const analysis = await analyze_risk_with_ai({
        title: task.title,
        input: task.input,
      });

      // 🔍 사람이 바로 이해할 수 있는 로그
      logger.info("AI_RISK_ANALYSIS_RESULT", {
        taskId: task.id,
        title: task.title,
        riskLevel: analysis.riskLevel,
        score: analysis.score,
        reason: analysis.reason,
      });
    } catch (err) {
      logger.error("AI_RISK_ANALYSIS_FAILED", {
        taskId: task?.id,
        error: err.message,
      });
    }
  });
}
