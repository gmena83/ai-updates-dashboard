import { FormEvent, useMemo, useState } from "react";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardDataset, LeadRequestPayload } from "@/types/dashboard";

interface LeadCaptureFormProps {
  dataset: DashboardDataset;
}

const LeadCaptureForm = ({ dataset }: LeadCaptureFormProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const payload = useMemo<LeadRequestPayload>(
    () => ({
      email,
      name,
      company,
      role,
      consent,
      snapshot: {
        updatedAt: dataset.updatedAt,
        selectedMetrics: dataset.metrics.slice(0, 4),
        selectedModels: dataset.models.slice(0, 3),
      },
    }),
    [company, consent, dataset.metrics, dataset.models, dataset.updatedAt, email, name, role],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !consent) {
      toast({
        title: "Falta un dato",
        description: "Agrega tu correo y acepta recibir el reporte.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.functions.invoke("lead-report", {
      body: payload,
    });

    setIsSubmitting(false);

    if (error || data?.success === false) {
      const fallbackOk = await submitNetlifyFallback(payload);

      if (fallbackOk) {
        toast({
          title: "Datos recibidos",
          description:
            "Capturamos tu solicitud. El envio automatico del PDF queda listo al activar Resend en Supabase.",
        });
        setEmail("");
        setName("");
        setCompany("");
        setRole("");
        return;
      }

      toast({
        title: "No se pudo enviar el PDF",
        description:
          data?.error ||
          error?.message ||
          "Revisa la configuracion de RESEND_API_KEY en Supabase.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reporte enviado",
      description: "Te enviamos el PDF con los datos clave del dashboard.",
    });

    setEmail("");
    setName("");
    setCompany("");
    setRole("");
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 px-5 py-8 text-white shadow-2xl sm:px-8">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(250,71,4,.25)_1px,transparent_1px),linear-gradient(0deg,rgba(34,211,238,.18)_1px,transparent_1px)] [background-size:56px_56px]" />
      <img
        src="/brand/menatech-pattern-orange.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-2rem] left-[-10rem] hidden h-32 w-[38rem] object-contain opacity-10 mix-blend-screen lg:block"
      />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-sm text-orange-100">
            <Mail className="h-4 w-4" />
            Lead magnet Menatech
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Recibe un PDF con los datos que importan para evaluar IA en tu empresa.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
            El resumen prioriza horas ahorradas, productividad, ahorro de costos y modelos
            recomendados para PYMEs. Es el puente natural hacia una evaluacion AI Readiness.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Sin contenido cerrado agresivo: solo atribucion, contexto y siguiente paso claro.
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="lead-email" className="text-zinc-100">
                Correo
              </Label>
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@empresa.com"
                className="mt-2 border-white/20 bg-white/95 text-zinc-950"
                required
              />
            </div>
            <div>
              <Label htmlFor="lead-name" className="text-zinc-100">
                Nombre
              </Label>
              <Input
                id="lead-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Opcional"
                className="mt-2 border-white/20 bg-white/95 text-zinc-950"
              />
            </div>
            <div>
              <Label htmlFor="lead-company" className="text-zinc-100">
                Empresa
              </Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Opcional"
                className="mt-2 border-white/20 bg-white/95 text-zinc-950"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead-role" className="text-zinc-100">
                Rol o area
              </Label>
              <Input
                id="lead-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Founder, gerente, operaciones, ventas..."
                className="mt-2 border-white/20 bg-white/95 text-zinc-950"
              />
            </div>
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm leading-5 text-zinc-300">
            <Checkbox
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5 border-white/40 data-[state=checked]:bg-orange-500"
            />
            <span>
              Acepto recibir el reporte y que Menatech pueda contactarme sobre AI Readiness.
            </span>
          </label>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full bg-[#D93D03] text-white hover:bg-[#B83300]"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Enviando PDF..." : "Enviar PDF a mi correo"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default LeadCaptureForm;

const submitNetlifyFallback = async (payload: LeadRequestPayload): Promise<boolean> => {
  try {
    const body = new URLSearchParams({
      "form-name": "ai-dashboard-lead",
      email: payload.email,
      name: payload.name ?? "",
      company: payload.company ?? "",
      role: payload.role ?? "",
      snapshot: JSON.stringify(payload.snapshot),
    });

    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    return response.ok;
  } catch {
    return false;
  }
};
