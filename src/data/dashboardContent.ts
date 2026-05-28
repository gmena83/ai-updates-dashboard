import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  FileText,
  Newspaper,
  ScrollText,
} from "lucide-react";
import type {
  ContentItem,
  DashboardDataset,
  DashboardSectionId,
  ModelComparison,
  SectionDefinition,
  SourceRef,
} from "@/types/dashboard";

const sources = {
  mckinseyAi2025: {
    name: "McKinsey - The State of AI 2025",
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
    kind: "consultora",
  },
  bcgValueGap: {
    name: "BCG - Are You Generating Value from AI?",
    url: "https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap",
    kind: "consultora",
  },
  pwcGenAi: {
    name: "PwC - Generative AI impact on business",
    url: "https://www.pwc.com/us/en/tech-effect/ai-analytics/generative-ai-impact-on-business.html",
    kind: "consultora",
  },
  nberProductivity: {
    name: "NBER - The Rapid Adoption of Generative AI",
    url: "https://www.nber.org/system/files/working_papers/w32966/w32966.pdf",
    kind: "academica",
  },
  workPatterns: {
    name: "Empirical Economics of AI - Shifting Work Patterns",
    url: "https://empirical-economics-of-ai.vercel.app/papers/DillonJaffeImmorlicaEtAl_2025_ShiftingWorkPatterns",
    kind: "academica",
  },
  openAiModels: {
    name: "OpenAI - Models",
    url: "https://platform.openai.com/docs/models",
    kind: "oficial",
  },
  anthropicModels: {
    name: "Anthropic - Claude models",
    url: "https://docs.anthropic.com/en/docs/about-claude/models/overview",
    kind: "oficial",
  },
  googleModels: {
    name: "Google - Gemini models",
    url: "https://ai.google.dev/gemini-api/docs/models",
    kind: "oficial",
  },
  perplexityModels: {
    name: "Perplexity - Sonar models",
    url: "https://docs.perplexity.ai/docs/sonar/models",
    kind: "oficial",
  },
  deepseekDocs: {
    name: "DeepSeek - API docs",
    url: "https://api-docs.deepseek.com/",
    kind: "oficial",
  },
  stanfordIndex: {
    name: "Stanford HAI - AI Index",
    url: "https://hai.stanford.edu/ai-index",
    kind: "academica",
  },
  resEndDocs: {
    name: "Resend - Send Email API",
    url: "https://resend.com/docs/api-reference/emails/send-email",
    kind: "oficial",
  },
  supabaseCron: {
    name: "Supabase - Scheduling Edge Functions",
    url: "https://supabase.com/docs/guides/functions/schedule-functions",
    kind: "oficial",
  },
} satisfies Record<string, SourceRef>;

export const sectionDefinitions: SectionDefinition[] = [
  {
    id: "news",
    title: "Noticias recientes sobre IA",
    description:
      "Desarrollos empresariales, legales, medicos y sociales, filtrados por impacto real en negocios pequenos.",
    icon: Newspaper,
    accent: "orange",
    hoverHint: "Senales de mercado para decidir que observar esta semana.",
  },
  {
    id: "metrics",
    title: "Metricas claves",
    description:
      "Indicadores verificables sobre productividad, ahorro de tiempo, costos y adopcion de IA.",
    icon: BarChart3,
    accent: "cyan",
    hoverHint: "Numeros para convertir curiosidad en una conversacion de negocio.",
  },
  {
    id: "reports",
    title: "Reportes en profundidad",
    description:
      "Estudios de consultoras, instituciones y observatorios que ayudan a separar hype de oportunidad.",
    icon: FileText,
    accent: "green",
    hoverHint: "Lecturas largas traducidas a implicaciones practicas para PYMEs.",
  },
  {
    id: "papers",
    title: "Papers academicos y cientificos",
    description:
      "Investigacion revisada por pares o working papers relevantes para productividad y cambio laboral.",
    icon: BookOpen,
    accent: "purple",
    hoverHint: "Evidencia mas lenta, pero mas util para decisiones serias.",
  },
  {
    id: "llmNews",
    title: "Noticias sobre LLMs",
    description:
      "Anuncios oficiales de OpenAI, Anthropic, DeepSeek, Google, Perplexity y otros proveedores clave.",
    icon: BrainCircuit,
    accent: "orange",
    hoverHint: "Que modelo conviene para ventas, operaciones, soporte o analisis.",
  },
  {
    id: "manuals",
    title: "Manuales oficiales",
    description:
      "Guias y documentacion oficial para aterrizar casos de uso sin depender de rumores.",
    icon: ScrollText,
    accent: "cyan",
    hoverHint: "Tutoriales convertibles en playbooks internos para equipos chicos.",
  },
];

export const fallbackDataset: DashboardDataset = {
  updatedAt: "2026-05-28T09:00:00-04:00",
  nextUpdateCadence: "Actualizacion editorial semanal",
  metrics: [
    {
      id: "weekly-hours-saved",
      label: "Horas ahorradas por semana",
      value: "2.2 h",
      change: "Promedio base",
      trend: "up",
      description:
        "Estimacion sobre trabajadores que usan IA generativa: 5.4% de una semana laboral de 40 horas equivale a unas 2.2 horas recuperadas.",
      businessUse:
        "Sirve para abrir una evaluacion de tareas repetitivas: email, documentacion, analisis y soporte.",
      source: sources.nberProductivity,
      chartValue: 2.2,
      unit: "horas",
    },
    {
      id: "productivity-lift",
      label: "Aumento de productividad",
      value: "20-40%",
      change: "Usuarios regulares",
      trend: "up",
      description:
        "PwC reporta ganancias de productividad en personas que usan herramientas de IA de forma regular dentro de flujos de trabajo definidos.",
      businessUse:
        "El mayor retorno aparece cuando la herramienta se integra a un proceso, no cuando se usa como chatbot aislado.",
      source: sources.pwcGenAi,
      chartValue: 30,
      unit: "%",
    },
    {
      id: "cost-reduction",
      label: "Reduccion de costos",
      value: "3x",
      change: "Empresas AI-ready",
      trend: "up",
      description:
        "BCG observa que companias con madurez en IA capturan reducciones de costo mucho mayores que organizaciones que solo experimentan.",
      businessUse:
        "La diferencia suele estar en datos, procesos y adopcion; justo el centro de una evaluacion AI Readiness.",
      source: sources.bcgValueGap,
      chartValue: 3,
      unit: "x",
    },
    {
      id: "ai-adoption",
      label: "Organizaciones usando IA",
      value: "88%",
      change: "Uso regular",
      trend: "up",
      description:
        "McKinsey reporta adopcion amplia de IA en al menos una funcion de negocio, con brecha entre uso y valor escalado.",
      businessUse:
        "Ya no se trata de si usar IA, sino de donde aplicarla con control y retorno medible.",
      source: sources.mckinseyAi2025,
      chartValue: 88,
      unit: "%",
    },
  ],
  items: [
    {
      id: "mckinsey-state-ai-2025",
      section: "reports",
      title: "La adopcion de IA se amplia, pero el valor sigue concentrado",
      description:
        "El reporte 2025 de McKinsey muestra que muchas organizaciones ya usan IA, pero pocas han redisenado procesos para capturar valor sostenido.",
      source: sources.mckinseyAi2025,
      date: "2025-11-20",
      impact: "Alto",
      tags: ["adopcion", "estrategia", "operaciones"],
      aiReadinessAngle:
        "Antes de comprar mas herramientas, conviene mapear procesos, datos y responsables.",
    },
    {
      id: "bcg-value-gap",
      section: "metrics",
      title: "La brecha de valor en IA premia a empresas preparadas",
      description:
        "BCG destaca que las companias mas maduras obtienen multiples superiores en ingresos y reduccion de costos frente al resto.",
      source: sources.bcgValueGap,
      date: "2025-09-18",
      impact: "Alto",
      tags: ["costos", "madurez", "retorno"],
      aiReadinessAngle:
        "La preparacion operativa es lo que transforma pilotos en ahorro real.",
    },
    {
      id: "work-patterns-copilot",
      section: "papers",
      title: "La IA reduce tiempo de email antes que transformar toda la empresa",
      description:
        "Un experimento con miles de trabajadores muestra caidas relevantes en tiempo de email, con efectos mas limitados en reuniones y documentos.",
      source: sources.workPatterns,
      date: "2025-10-01",
      impact: "Medio",
      tags: ["productividad", "email", "experimento"],
      aiReadinessAngle:
        "Empieza por tareas individuales medibles antes de redisenar areas completas.",
    },
    {
      id: "openai-models-frontier",
      section: "llmNews",
      title: "OpenAI posiciona GPT-5.5 como modelo insignia para trabajo profesional",
      description:
        "La documentacion oficial recomienda el modelo frontier para razonamiento complejo, coding y flujos con herramientas.",
      source: sources.openAiModels,
      date: "2026-05-28",
      impact: "Alto",
      tags: ["LLM", "modelos", "automatizacion"],
      aiReadinessAngle:
        "Ideal para prototipos de agentes internos, analisis y documentacion avanzada.",
    },
    {
      id: "anthropic-models",
      section: "llmNews",
      title: "Claude mantiene una linea fuerte para razonamiento y trabajo largo",
      description:
        "Anthropic documenta modelos Claude con ventanas de contexto amplias y foco en razonamiento, velocidad y agentes.",
      source: sources.anthropicModels,
      date: "2026-05-28",
      impact: "Alto",
      tags: ["Claude", "agentes", "documentos"],
      aiReadinessAngle:
        "Buen candidato para empresas con contratos, documentos largos o procesos de analisis interno.",
    },
    {
      id: "gemini-models",
      section: "manuals",
      title: "Gemini combina modelos de razonamiento, voz e imagen para flujos multimodales",
      description:
        "La documentacion de Google lista opciones para baja latencia, razonamiento complejo, audio y generacion visual.",
      source: sources.googleModels,
      date: "2026-05-28",
      impact: "Medio",
      tags: ["Gemini", "multimodal", "documentacion"],
      aiReadinessAngle:
        "Util cuando una PYME quiere unir texto, imagen, reuniones y soporte en un solo flujo.",
    },
    {
      id: "resend-leads",
      section: "manuals",
      title: "Resend permite enviar reportes con adjuntos desde una API simple",
      description:
        "La API oficial soporta emails transaccionales con HTML, texto, etiquetas de seguimiento y archivos adjuntos.",
      source: sources.resEndDocs,
      date: "2026-05-28",
      impact: "Medio",
      tags: ["lead magnet", "email", "PDF"],
      aiReadinessAngle:
        "Convierte el dashboard en un activo comercial: el usuario recibe su resumen y Menatech captura el lead.",
    },
    {
      id: "supabase-weekly",
      section: "news",
      title: "Supabase puede programar actualizaciones semanales de Edge Functions",
      description:
        "La documentacion permite agendar funciones con cron para refrescar datos sin depender de acciones manuales.",
      source: sources.supabaseCron,
      date: "2026-05-28",
      impact: "Medio",
      tags: ["backend", "automatizacion", "monitoreo"],
      aiReadinessAngle:
        "El tablero debe operar como sistema: refresco programado, logs y revision editorial.",
    },
  ],
  models: [
    {
      id: "openai-gpt-55",
      model: "GPT-5.5",
      provider: "OpenAI",
      bestFor: "Razonamiento complejo, coding y flujos con herramientas",
      pymeUseCase:
        "Agente de diagnostico operativo, analisis de documentos, automatizacion de propuestas.",
      caution: "Costo mayor; conviene reservarlo para tareas de alto valor.",
      source: sources.openAiModels,
      score: 96,
    },
    {
      id: "claude-opus-47",
      model: "Claude Opus 4.7",
      provider: "Anthropic",
      bestFor: "Trabajo largo, razonamiento y agentes de alta precision",
      pymeUseCase:
        "Revision de contratos, politicas internas, SOPs y analisis de conversaciones extensas.",
      caution: "Evaluar disponibilidad regional y costos antes de escalar.",
      source: sources.anthropicModels,
      score: 94,
    },
    {
      id: "gemini-25-pro",
      model: "Gemini 2.5 Pro",
      provider: "Google",
      bestFor: "Razonamiento multimodal y ecosistema Google",
      pymeUseCase:
        "Analisis de reuniones, imagenes, documentos de Drive y workflows conectados a Workspace.",
      caution: "Revisar privacidad y permisos de datos en implementaciones Workspace.",
      source: sources.googleModels,
      score: 91,
    },
    {
      id: "perplexity-sonar-pro",
      model: "Sonar Pro",
      provider: "Perplexity",
      bestFor: "Investigacion con busqueda web y fuentes recientes",
      pymeUseCase:
        "Monitoreo de competencia, noticias, proveedores, regulacion y tendencias sectoriales.",
      caution: "Usar como capa de investigacion; validar fuentes antes de publicar.",
      source: sources.perplexityModels,
      score: 89,
    },
    {
      id: "deepseek-v32",
      model: "DeepSeek V3.2",
      provider: "DeepSeek",
      bestFor: "Costo competitivo y razonamiento con modo thinking",
      pymeUseCase:
        "Backoffice, prototipos internos, clasificacion y soporte donde el costo por token importa.",
      caution: "Revisar politicas de datos, jurisdiccion y deprecaciones de modelos.",
      source: sources.deepseekDocs,
      score: 84,
    },
  ],
};

export const getItemsBySection = (sectionId: DashboardSectionId, dataset = fallbackDataset) =>
  dataset.items.filter((item) => item.section === sectionId);

export const monitoredSources = Object.values(sources);
