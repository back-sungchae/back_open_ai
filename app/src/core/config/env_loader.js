import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function strip_quotes(value) {
  const v = value.trim();
  if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function load_env_file(file_path) {
  let content;
  try {
    content = fs.readFileSync(file_path, "utf8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const raw = trimmed.slice(idx + 1);
    if (!key) continue;
    if (process.env[key] !== undefined) continue;

    process.env[key] = strip_quotes(raw);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env_path = path.resolve(__dirname, "../../../.env");
load_env_file(env_path);
