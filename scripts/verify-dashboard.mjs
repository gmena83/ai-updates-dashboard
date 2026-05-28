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
      const snapshotMigration = read("supabase/migrations/20260528161500_dashboard_snapshots.sql");
      return (
        config.includes("[functions.perplexity-search]") &&
        config.includes("[functions.lead-report]") &&
        migration.includes("dashboard_items") &&
        migration.includes("dashboard_leads") &&
        migration.includes("dashboard_refresh_runs") &&
        snapshotMigration.includes("dashboard_snapshots") &&
        snapshotMigration.includes("data_snapshot")
      );
    },
  },
  {
    name: "public dashboard reads latest snapshot without triggering refresh",
    run: () => {
      const service = read("src/services/perplexityService.ts");
      const dashboard = read("src/components/dashboard/DashboardHome.tsx");
      return (
        service.includes('body: { action: "latest" }') &&
        dashboard.includes("syncLatestDataset") &&
        !dashboard.includes('action: "refresh"')
      );
    },
  },
  {
    name: "backend protects live refresh behind admin or cron secret",
    run: () => {
      const fn = read("supabase/functions/perplexity-search/index.ts");
      return (
        fn.includes('action?: "health" | "latest" | "refresh"') &&
        fn.includes("getAdminContext") &&
        fn.includes("@menatech.cloud") &&
        fn.includes("DASHBOARD_CRON_SECRET") &&
        fn.includes("dashboard_snapshots?on_conflict=id")
      );
    },
  },
  {
    name: "netlify SPA redirect is configured",
    run: () => {
      const netlifyConfig = read("netlify.toml");
      return netlifyConfig.includes('to = "/index.html"') && netlifyConfig.includes('from = "/lovable-uploads/*"');
    },
  },
  {
    name: "legacy cyan logo is not referenced",
    run: () => {
      const files = [
        "src/App.tsx",
        "src/components/dashboard/DashboardHeader.tsx",
        "src/components/dashboard/DashboardHome.tsx",
        "src/pages/EmbedCta.tsx",
      ];
      const oldUploadPath = ["lovable", "-uploads"].join("");
      const oldAssetName = ["menatech", "-logo", ".png"].join("");
      return files.every((file) => {
        const content = read(file);
        return !content.includes(oldUploadPath) && !content.includes(oldAssetName);
      });
    },
  },
  {
    name: "official orange brand assets are used",
    run: () => {
      const dashboard = read("src/components/dashboard/DashboardHome.tsx");
      const embed = read("src/pages/EmbedCta.tsx");
      return (
        existsSync(join(root, "public", "brand", "menatech-iso-orange.png")) &&
        existsSync(join(root, "public", "brand", "menatech-pattern-orange.png")) &&
        dashboard.includes("/brand/menatech-iso-orange.png") &&
        dashboard.includes("/brand/menatech-pattern-orange.png") &&
        embed.includes("/brand/menatech-pattern-orange.png")
      );
    },
  },
  {
    name: "legacy hardcoded admin password is removed",
    run: () => {
      const login = read("src/components/auth/LoginModal.tsx");
      const legacyPasswordToken = ["Menatech", "Rocks"].join("");
      return !login.includes(legacyPasswordToken) && login.includes("signInWithOtp");
    },
  },
  {
    name: "admin magic link reports Supabase connectivity issues",
    run: () => {
      const admin = read("src/pages/Admin.tsx");
      const client = read("src/integrations/supabase/client.ts");
      const messages = read("src/lib/supabaseAuthMessages.ts");
      return (
        admin.includes("buildMagicLinkIssue") &&
        admin.includes("authIssue") &&
        client.includes("VITE_SUPABASE_URL") &&
        client.includes('flowType: "pkce"') &&
        messages.includes("Supabase no responde")
      );
    },
  },
  {
    name: "dashboard contrast bands are present",
    run: () => {
      const dashboard = read("src/components/dashboard/DashboardHome.tsx");
      return (
        dashboard.includes("bg-zinc-950 py-10 text-white") &&
        dashboard.includes("bg-[#e4e7eb] py-10") &&
        dashboard.includes("shadow-zinc-300/50")
      );
    },
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
