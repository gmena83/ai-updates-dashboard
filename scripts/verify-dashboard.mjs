import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [
  {
    name: "production build exists",
    run: () => existsSync(join(root, "dist", "index.html")),
  },
  {
    name: "dashboard routes are registered",
    run: () => {
      const app = read("src/App.tsx");
      return app.includes('path="/dashboard_ia"') && app.includes('path="/embed/cta"') && app.includes('path="/admin"');
    },
  },
  {
    name: "lead capture invokes Resend function and Netlify fallback",
    run: () => {
      const leadForm = read("src/components/dashboard/LeadCaptureForm.tsx");
      return leadForm.includes('functions.invoke("lead-report"') && leadForm.includes('"form-name": "ai-dashboard-lead"');
    },
  },
  {
    name: "admin supports editorial edit, hide, restore, delete",
    run: () => {
      const admin = read("src/pages/Admin.tsx");
      return ["Editar", "Ocultar", "Publicar", "Eliminar", "dashboard_items"].every((needle) => admin.includes(needle));
    },
  },
  {
    name: "fallback metrics include priority business outcomes",
    run: () => {
      const content = read("src/data/dashboardContent.ts");
      return ["Horas ahorradas por semana", "Aumento de productividad", "Reduccion de costos"].every((needle) =>
        content.includes(needle),
      );
    },
  },
  {
    name: "source attribution uses real source URLs",
    run: () => {
      const content = read("src/data/dashboardContent.ts");
      return [
        "https://www.mckinsey.com/",
        "https://www.bcg.com/",
        "https://platform.openai.com/docs/models",
        "https://docs.anthropic.com/",
      ].every((needle) => content.includes(needle));
    },
  },
  {
    name: "supabase functions and migration are present",
    run: () => {
      const config = read("supabase/config.toml");
      const migration = read("supabase/migrations/20260528143000_ai_dashboard_leads_admin.sql");
      return (
        config.includes("[functions.perplexity-search]") &&
        config.includes("[functions.lead-report]") &&
        migration.includes("dashboard_items") &&
        migration.includes("dashboard_leads") &&
        migration.includes("dashboard_refresh_runs")
      );
    },
  },
  {
    name: "netlify SPA redirect is configured",
    run: () => read("netlify.toml").includes('to = "/index.html"'),
  },
];

const failures = checks.filter((check) => !check.run());

if (failures.length > 0) {
  console.error("Dashboard verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`Dashboard verification passed (${checks.length} checks).`);

function read(path) {
  return readFileSync(join(root, path), "utf8");
}
