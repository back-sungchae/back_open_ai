import OpenAI from "openai";

function get_client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function normalize_risk_level(value) {
  const v = String(value || "").trim().toUpperCase();
  if (v === "HIGH" || v === "MEDIUM" || v === "LOW") return v;
  return "LOW";
}

function score_from_level(level) {
  switch (level) {
    case "HIGH":
      return 8;
    case "MEDIUM":
      return 5;
    default:
      return 2;
  }
}

export async function analyze_risk_with_ai({ title, input }) {
  const client = get_client();
  if (!client) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  const prompt = `
You are a risk analysis assistant.
Classify the task risk level as LOW, MEDIUM, or HIGH.
Return JSON only with keys: riskLevel, reason, score (0-10).

Task title: ${title}
Task input: ${input || ""}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const content = res.choices[0].message.content || "";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = null;
  }

  if (parsed && typeof parsed === "object") {
    const riskLevel = normalize_risk_level(parsed.riskLevel);
    return {
      riskLevel,
      reason: String(parsed.reason || "").trim(),
      score: Number.isFinite(parsed.score) ? parsed.score : score_from_level(riskLevel),
    };
  }

  const riskLevel = normalize_risk_level(content);
  return {
    riskLevel,
    reason: content.trim(),
    score: score_from_level(riskLevel),
  };
}

export const analyze_risk = analyze_risk_with_ai;
