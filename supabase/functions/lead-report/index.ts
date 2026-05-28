import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface LeadPayload {
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  consent?: boolean;
  snapshot?: {
    updatedAt?: string;
    selectedMetrics?: Array<Record<string, unknown>>;
    selectedModels?: Array<Record<string, unknown>>;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ success: true });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const payload = (await req.json().catch(() => ({}))) as LeadPayload;
    const email = normalizeEmail(payload.email);

    if (!email || payload.consent !== true) {
      return jsonResponse({ success: false, error: "Correo y consentimiento requeridos" }, 400);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return jsonResponse({ success: false, error: "RESEND_API_KEY no configurada" }, 500);
    }

    await persistLead(payload, email);

    const pdfBase64 = createPdfBase64(payload);
    const html = renderEmailHtml(payload, email);
    const from = Deno.env.get("RESEND_FROM") ?? "Menatech <dashboard@menatech.cloud>";
    const notifyTo = Deno.env.get("LEAD_NOTIFY_EMAIL") ?? "gonzalo@menatech.cloud";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        bcc: [notifyTo],
        subject: "Tu resumen del AI Impact Dashboard de Menatech",
        html,
        attachments: [
          {
            filename: "menatech-ai-impact-dashboard.pdf",
            content: pdfBase64,
          },
        ],
        tags: [
          { name: "source", value: "ai_dashboard" },
          { name: "intent", value: "ai_readiness" },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Resend ${response.status}: ${errorText.slice(0, 240)}` }, 502);
    }

    const data = (await response.json()) as Record<string, unknown>;
    return jsonResponse({ success: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("lead-report failed:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

async function persistLead(payload: LeadPayload, email: string): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRole) return;

  await fetch(`${supabaseUrl}/rest/v1/dashboard_leads`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name: cleanText(payload.name),
      company: cleanText(payload.company),
      role: cleanText(payload.role),
      consent: true,
      report_snapshot: payload.snapshot ?? {},
      source_path: "ai-impact-dashboard",
    }),
  }).catch(() => undefined);
}

function renderEmailHtml(payload: LeadPayload, email: string): string {
  const name = cleanText(payload.name) || email;
  const updatedAt = payload.snapshot?.updatedAt
    ? new Intl.DateTimeFormat("es-PR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(payload.snapshot.updatedAt))
    : "reciente";

  return `
    <div style="font-family: Montserrat, Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1 style="color: #FA4704;">Tu resumen AI Impact Dashboard</h1>
      <p>Hola ${escapeHtml(name)},</p>
      <p>Adjuntamos el PDF con las metricas y modelos clave del dashboard de Menatech. Ultima actualizacion: ${escapeHtml(updatedAt)}.</p>
      <p>Si quieres convertir estas senales en un plan concreto, el siguiente paso recomendado es una evaluacion <strong>AI Readiness</strong>.</p>
      <p><a href="https://menatech.cloud" style="color:#FA4704;font-weight:700;">Agendar evaluacion con Menatech</a></p>
    </div>
  `;
}

function createPdfBase64(payload: LeadPayload): string {
  const metrics = payload.snapshot?.selectedMetrics ?? [];
  const models = payload.snapshot?.selectedModels ?? [];
  const lines = [
    "Menatech AI Impact Dashboard",
    "Resumen para evaluacion AI Readiness",
    `Contacto: ${cleanText(payload.email)}`,
    `Empresa: ${cleanText(payload.company) || "No indicada"}`,
    "",
    "Metricas clave",
    ...metrics.slice(0, 4).map((metric) => {
      const label = cleanText(metric.label) || cleanText(metric.name) || "Metrica";
      const value = cleanText(metric.value) || "N/A";
      return `- ${label}: ${value}`;
    }),
    "",
    "Modelos recomendados",
    ...models.slice(0, 4).map((model) => {
      const provider = cleanText(model.provider) || "Proveedor";
      const name = cleanText(model.model) || "Modelo";
      const useCase = cleanText(model.pymeUseCase) || cleanText(model.bestFor) || "Caso de uso pendiente";
      return `- ${provider} ${name}: ${useCase}`;
    }),
    "",
    "Siguiente paso: agenda una evaluacion AI Readiness en menatech.cloud",
  ];

  return btoa(createSimplePdf(lines));
}

function createSimplePdf(lines: string[]): string {
  const safeLines = lines.flatMap((line) => wrapPdfLine(stripAccents(line), 86));
  const textOps = safeLines
    .slice(0, 42)
    .map((line, index) => `BT /F1 11 Tf 50 ${760 - index * 16} Td (${escapePdf(line)}) Tj ET`)
    .join("\n");
  const stream = `${textOps}\n`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}endstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function wrapPdfLine(line: string, maxLength: number): string[] {
  const words = line.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapePdf(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
