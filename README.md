# Menatech AI Impact Dashboard

Dashboard interactivo para mostrar noticias, metricas, reportes, papers, modelos LLM y manuales oficiales relevantes para PYMEs que quieren adoptar IA sin perder claridad operativa.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth, Database y Edge Functions
- Perplexity para investigacion web con fuentes
- Resend para enviar el PDF del lead magnet
- Netlify recomendado para hosting estatico

## Rutas

- `/` y `/dashboard_ia`: dashboard completo
- `/embed/cta`: CTA compacto para embeber o enlazar desde `menatech.cloud`
- `/admin`: panel protegido por magic link para correos `@menatech.cloud`

## Variables y secretos

Frontend:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

Supabase Edge Function secrets:

```env
PERPLEXITY_API_KEY=
PERPLEXITY_MODEL=sonar-pro
RESEND_API_KEY=
RESEND_FROM="Menatech <dashboard@menatech.cloud>"
LEAD_NOTIFY_EMAIL=gonzalo@menatech.cloud
SUPABASE_SERVICE_ROLE_KEY=
DASHBOARD_CRON_SECRET=
```

## Desarrollo local

```sh
npm ci
npm run dev
```

## Produccion recomendada

1. Aplicar migraciones de Supabase.
2. Desplegar Edge Functions `perplexity-search` y `lead-report`.
3. Configurar secretos en Supabase.
4. Desplegar frontend en Netlify.
5. Conectar `dashboard.menatech.cloud` o usar una regla del sitio principal hacia `/dashboard_ia`.
6. Programar refresco semanal con Supabase Cron invocando `perplexity-search` con `{ "action": "refresh" }` y el header `x-dashboard-cron-secret`.

## Flujo de datos

- El dashboard publico carga primero un snapshot local curado y luego intenta leer `perplexity-search` con `{ "action": "latest" }`.
- La accion `latest` lee `dashboard_snapshots`, no dispara busquedas externas y puede ser usada por visitantes.
- Las acciones `health`, `refresh` y las busquedas individuales requieren magic link `@menatech.cloud` o `DASHBOARD_CRON_SECRET`.
- La accion `refresh` consulta Perplexity, genera metricas/entradas/modelos con fuentes, guarda `dashboard_snapshots`, actualiza `dashboard_items` y registra `dashboard_refresh_runs`.
- El lead magnet llama `lead-report`, guarda el lead en `dashboard_leads` si hay service role y envia el PDF con Resend. Si la funcion no esta disponible, Netlify Forms captura el lead como respaldo sin PDF automatico.

## Admin y magic link

El panel `/admin` depende de Supabase Auth. En Supabase Auth > URL Configuration configura:

- Site URL: `https://menatech-ai-impact-dashboard.netlify.app`
- Redirect URL: `https://menatech-ai-impact-dashboard.netlify.app/admin`
- Redirect URL local: `http://localhost:5173/admin`

Si el admin muestra `Supabase no responde`, revisa que el proyecto no este pausado y que el deploy tenga `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` apuntando al proyecto correcto.

## Comandos Supabase

```sh
npx supabase link --project-ref vzkyzfwqjiskwnnapiin
npx supabase db push
npx supabase functions deploy perplexity-search
npx supabase functions deploy lead-report
npx supabase secrets set PERPLEXITY_API_KEY=... RESEND_API_KEY=... RESEND_FROM="Menatech <dashboard@menatech.cloud>" LEAD_NOTIFY_EMAIL=gonzalo@menatech.cloud SUPABASE_SERVICE_ROLE_KEY=... DASHBOARD_CRON_SECRET=...
```

## APIs recomendadas

- Perplexity Sonar Pro: noticias, reportes y busqueda con fuentes recientes.
- Resend: envio del PDF y notificaciones de leads.
- Semantic Scholar, Crossref y OpenAlex: respaldo futuro para papers academicos.
- GDELT o Guardian Open Platform: respaldo futuro para noticias si se quiere reducir dependencia de Perplexity.
- Supabase Cron + Edge Functions: actualizaciones semanales, cache, auditoria y panel admin.
