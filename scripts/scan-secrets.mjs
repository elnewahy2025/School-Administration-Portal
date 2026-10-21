import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".zwork",
  "coverage",
  "playwright-report",
  "test-results",
  "out",
  "build",
]);
const ENV_FILE = /^\.env(\..+)?$/;
const PATTERNS = [
  {
    name: "JWT-like secret",
    re: /eyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/,
  },
  { name: "private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    name: "generic API key",
    re: /\b(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|sbp_[A-Za-z0-9]{30,})\b/,
  },
];

function scanFile(full, findings) {
  let size = 0;
  try {
    size = statSync(full).size;
  } catch {
    return;
  }
  if (size > 1_000_000) return;
  let text;
  try {
    text = readFileSync(full, "utf8");
  } catch {
    return;
  }
  for (const { name, re } of PATTERNS) {
    if (re.test(text)) findings.push(`${full}: matches ${name}`);
  }
}

function main() {
  const findings = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
        continue;
      }
      if (ENV_FILE.test(entry.name) && entry.name !== ".env.example") {
        findings.push(`${join(dir, entry.name)}: local env file must not be committed`);
        continue;
      }
      scanFile(join(dir, entry.name), findings);
    }
  };
  walk(process.cwd());
  if (findings.length > 0) {
    console.error("Secret scan failed:");
    for (const finding of findings) console.error(` - ${finding}`);
    process.exit(1);
  }
  console.log("Secret scan passed.");
}

main();
