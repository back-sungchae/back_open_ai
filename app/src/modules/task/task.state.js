export const TASK_STATUS = Object.freeze({
  PENDING: "pending",
  RUNNING: "running",
  SUCCESS: "success",
  FAILED: "failed",
});

export const TASK_TRANSITIONS = Object.freeze({
  [TASK_STATUS.PENDING]: [TASK_STATUS.RUNNING],
  [TASK_STATUS.RUNNING]: [TASK_STATUS.SUCCESS, TASK_STATUS.FAILED],
});

export function is_task_status(value) {
  return Object.values(TASK_STATUS).includes(value);
}

export function can_transition(from, to) {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}
