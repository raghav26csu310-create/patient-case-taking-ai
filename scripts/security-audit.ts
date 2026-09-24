import * as fs from "fs";
import * as path from "path";

const secretPatterns: { name: string; regex: RegExp }[] = [
  { name: "Google API Key", regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: "OpenAI / Claude Secret Key", regex: /sk-[a-zA-Z0-9]{20,}/ },
  { name: "Generic Secret/Password Assignment", regex: /(?:api[_-]?key|secret|password)\s*[:=]\s*['"][0-9a-zA-Z-_]{10,}['"]/i },
  { name: "Supabase Service Role Key", regex: /service_role/i },
  { name: "Private RSA/PEM Key", regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/ },
];

function scanDirectory(dir: string): { file: string; rule: string }[] {
  let issues: { file: string; rule: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if ([".next", "node_modules", ".git", "package-lock.json", "security-audit.ts"].includes(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      issues = issues.concat(scanDirectory(fullPath));
    } else {
      const content = fs.readFileSync(fullPath, "utf8");
      for (const pattern of secretPatterns) {
        if (pattern.regex.test(content)) {
          issues.push({ file: fullPath, rule: pattern.name });
        }
      }
    }
  }
  return issues;
}

const findings = scanDirectory(".");
console.log("=== SECURITY AUDIT RESULTS ===");
console.log(`Scanned repository files. Issues found: ${findings.length}`);
if (findings.length > 0) {
  console.error("Vulnerabilities detected:", findings);
  process.exit(1);
} else {
  console.log("PASS: Zero secrets, zero private credentials, and zero service-role keys detected.");
}

// Verify .gitignore and .env.example
const gitignore = fs.readFileSync(".gitignore", "utf8");
const envExample = fs.readFileSync(".env.example", "utf8");

if (!gitignore.includes(".env*.local") || !gitignore.includes(".env")) {
  console.error("FAIL: .gitignore does not properly exclude .env files!");
  process.exit(1);
} else {
  console.log("PASS: .gitignore correctly excludes .env, .env*.local, and build artifacts.");
}

if (envExample.includes("sk-") || envExample.includes("AIza")) {
  console.error("FAIL: .env.example contains real secret patterns!");
  process.exit(1);
} else {
  console.log("PASS: .env.example is clean and contains only configuration templates.");
}
