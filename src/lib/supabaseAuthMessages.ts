import { supabaseConfig } from "@/integrations/supabase/client";

export interface MagicLinkIssue {
  title: string;
  description: string;
  detail: string;
}

export const buildMagicLinkIssue = (message: string, redirectUrl: string): MagicLinkIssue => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("failed to fetch") || lowerMessage.includes("network")) {
    return {
      title: "Supabase no responde",
      description:
        "No se pudo conectar con Supabase para enviar el magic link. El problema no es el correo: el backend de autenticacion no esta alcanzable desde la app.",
      detail: buildConfigDetail(redirectUrl),
    };
  }

  if (lowerMessage.includes("redirect") || lowerMessage.includes("not allowed")) {
    return {
      title: "Redirect URL no autorizado",
      description:
        "Supabase rechazo el enlace porque la URL de retorno del admin no esta en la lista permitida.",
      detail: `Agrega ${redirectUrl} en Supabase Auth > URL Configuration > Redirect URLs.`,
    };
  }

  return {
    title: "No se pudo enviar el enlace",
    description: message || "Supabase no devolvio un detalle especifico.",
    detail: buildConfigDetail(redirectUrl),
  };
};

const buildConfigDetail = (redirectUrl: string) =>
  `Proyecto detectado: ${supabaseConfig.projectRef}. ` +
  `Redirect esperado: ${redirectUrl}. ` +
  (supabaseConfig.usesFallbackConfig
    ? "El build esta usando la configuracion fallback del repo; configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Netlify/Supabase si el proyecto actual cambio."
    : "El build esta usando variables VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY del ambiente.");
