import { FormEvent, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApiStatus {
  perplexity: "ok" | "missing" | "unknown";
  resend: "ok" | "missing" | "unknown";
  database: "ok" | "missing" | "unknown";
  checkedAt?: string;
}

const emptyStatus: ApiStatus = {
  perplexity: "unknown",
  resend: "unknown",
  database: "unknown",
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ApiStatus>(emptyStatus);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const isMenatechUser = session?.user.email?.toLowerCase().endsWith("@menatech.cloud") ?? false;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!normalized.endsWith("@menatech.cloud")) {
      toast({
        title: "Dominio no autorizado",
        description: "El panel admin esta limitado a correos @menatech.cloud.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setIsSendingLink(false);

    if (error) {
      toast({
        title: "No se pudo enviar el enlace",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Revisa tu correo",
      description: "Te enviamos un magic link para entrar al panel.",
    });
  };

  const checkStatus = async () => {
    setIsChecking(true);
    const { data, error } = await supabase.functions.invoke("perplexity-search", {
      body: { action: "health" },
    });
    setIsChecking(false);

    if (error || data?.success === false) {
      toast({
        title: "No se pudo revisar el backend",
        description: data?.error || error?.message || "Revisa el despliegue de Edge Functions.",
        variant: "destructive",
      });
      return;
    }

    setStatus({
      perplexity: data?.services?.perplexity ?? "unknown",
      resend: data?.services?.resend ?? "unknown",
      database: data?.services?.database ?? "unknown",
      checkedAt: new Date().toISOString(),
    });
  };

  const manualRefresh = async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase.functions.invoke("perplexity-search", {
      body: { action: "refresh", maxResults: 6 },
    });
    setIsRefreshing(false);

    if (error || data?.success === false) {
      toast({
        title: "Actualizacion fallida",
        description: data?.error || error?.message || "No se pudo refrescar el dashboard.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Actualizacion ejecutada",
      description: `Se obtuvieron ${data?.data?.items?.length ?? 0} entradas y ${data?.data?.metrics?.length ?? 0} metricas.`,
    });
  };

  if (!session || !isMenatechUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/15 p-3 text-orange-200">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel admin Menatech</h1>
              <p className="text-sm text-zinc-300">Acceso con magic link @menatech.cloud</p>
            </div>
          </div>

          <Label htmlFor="admin-email" className="text-zinc-100">
            Correo Menatech
          </Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@menatech.cloud"
            className="mt-2 border-white/20 bg-white text-zinc-950"
            required
          />

          <Button type="submit" disabled={isSendingLink} className="mt-5 w-full bg-orange-600 hover:bg-orange-500">
            {isSendingLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            Enviar magic link
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Menatech
            </p>
            <h1 className="text-3xl font-black">Panel de control AI Dashboard</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Revisa APIs, ejecuta refrescos manuales y prepara la curaduria editorial.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/">Ver dashboard</a>
            </Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Perplexity"
            status={status.perplexity}
            description="Busqueda semanal, noticias, metricas y reportes."
          />
          <StatusCard
            title="Resend"
            status={status.resend}
            description="Envio de PDF y notificacion de leads."
          />
          <StatusCard
            title="Base de datos"
            status={status.database}
            description="Leads, cache editorial, auditoria de refrescos."
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/10">
            <div className="mb-4 flex items-center gap-3">
              <Database className="h-5 w-5 text-cyan-600" />
              <h2 className="text-xl font-bold">Operaciones</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={checkStatus} disabled={isChecking}>
                {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Revisar estado APIs
              </Button>
              <Button onClick={manualRefresh} disabled={isRefreshing} variant="outline">
                {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Actualizacion manual
              </Button>
            </div>
            {status.checkedAt && (
              <p className="mt-4 text-sm text-zinc-500">
                Ultima revision: {new Intl.DateTimeFormat("es-PR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(status.checkedAt))}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
            <div className="mb-4 flex items-center gap-3 text-orange-800 dark:text-orange-100">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-xl font-bold">Pendiente antes de produccion</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
              <li>Configurar secretos: PERPLEXITY_API_KEY, RESEND_API_KEY, RESEND_FROM y SUPABASE_SERVICE_ROLE_KEY.</li>
              <li>Aplicar la migracion de Supabase para leads, cache y auditoria.</li>
              <li>Programar el refresco semanal con Supabase Cron.</li>
              <li>Conectar dominio recomendado: dashboard.menatech.cloud.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

interface StatusCardProps {
  title: string;
  status: ApiStatus[keyof Omit<ApiStatus, "checkedAt">];
  description: string;
}

const StatusCard = ({ title, status, description }: StatusCardProps) => {
  const isOk = status === "ok";
  const isMissing = status === "missing";

  return (
    <article className="rounded-2xl border border-white/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isOk
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
              : isMissing
                ? "bg-red-500/10 text-red-700 dark:text-red-200"
                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300"
          }`}
        >
          {isOk ? "OK" : isMissing ? "Falta" : "Sin revisar"}
        </span>
      </div>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
    </article>
  );
};

export default Admin;
