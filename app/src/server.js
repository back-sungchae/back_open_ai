import "./core/config/env_loader.js";
import app from "./app.js";
import { start_risk_analyzer } from "./modules/ai/risk_analyzer.consumer.js";
import { start_state_decision_consumer } from "./modules/ai/state_decision.consumer.js";

const PORT = process.env.PORT || 3000;

start_risk_analyzer();
start_state_decision_consumer();

app.listen(PORT, () => {
  console.log(`server_started port=${PORT}`);
});
