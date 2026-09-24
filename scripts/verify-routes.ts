const routes = [
  { path: "/", expectedText: "First-Mile Clinical Case-Taking Intelligence" },
  { path: "/patient", expectedText: "Patient Assistance" },
  { path: "/clinician", expectedText: "Consultation Case Review" },
  { path: "/triage", expectedText: "OPD Emergency Priority" },
  { path: "/admin", expectedText: "Governance, Clinical Audit" },
  { path: "/api/health", expectedText: '"status":"healthy"' },
];

async function verifyAllRoutes() {
  console.log("=== VERIFYING ROUTE RESPONSES (HTTP 200 & CONTENT) ===");
  const baseUrl = "http://localhost:3000";

  let allPassed = true;

  for (const r of routes) {
    try {
      const url = `${baseUrl}${r.path}`;
      const res = await fetch(url);
      const text = await res.text();

      if (res.status !== 200) {
        console.error(`FAIL: ${r.path} returned status ${res.status}`);
        allPassed = false;
        continue;
      }

      if (!text.includes(r.expectedText)) {
        console.error(`FAIL: ${r.path} did not include expected text snippet "${r.expectedText}"`);
        allPassed = false;
        continue;
      }

      console.log(`PASS: ${r.path} -> HTTP ${res.status} [Content verified: "${r.expectedText}"]`);
    } catch (error) {
      console.error(`ERROR: Failed to connect to ${r.path}:`, error);
      allPassed = false;
    }
  }

  if (!allPassed) {
    process.exit(1);
  }
  console.log("=== ALL ROUTES RENDERED SUCCESSFULLY WITHOUT RUNTIME ERRORS ===");
}

verifyAllRoutes();
