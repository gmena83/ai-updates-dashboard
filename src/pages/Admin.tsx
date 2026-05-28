import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  RotateCcw,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardSectionId, ImpactLevel, SourceRef } from "@/types/dashboard";

interface ApiStatus {
  perplexity: "ok" | "missing" | "unknown";
  resend: "ok" | "missing" | "unknown";
  database: "ok" | "missing" | "unknown";
  checkedAt?: string;
}

interface DashboardItemRow {
  id: string;
  section: DashboardSectionId;
  title: string;
  description: string;
  source_name: string;
  source_url: string;
  source_kind: SourceRef["kind"];
  published_at: string | null;
  impact: ImpactLevel;
  tags: string[];
  ai_readiness_angle: string;
  status: "active" | "hidden" | "draft";
  updated_at: string;
}

interface SupabaseErrorLike {
  message: string;
}

interface AdminDbClient {
  from: (table: "dashboard_items") => {
    select: (columns: string) => {
      order: (
        column: string,
        options?: { ascending?: boolean; nullsFirst?: boolean },
      ) => Promise<{ data: DashboardItemRow[] | null; error: SupabaseErrorLike | null }>;
    };
    update: (
      values: Partial<DashboardItemRow>,
    ) => {
      eq: (
        column: "id",
        value: string,
      ) => {
        select: (
          columns: string,
        ) => {
          single: () => Promise<{ data: DashboardItemRow | null; error: SupabaseErrorLike | null }>;
        };
      };
    };
    delete: () => {
      eq: (column: "id", value: string) => Promise<{ error: SupabaseErrorLike | null }>;
    };
  };
}

const db = supabase as unknown as AdminDbClient;

const emptyStatus: ApiStatus = {
  perplexity: "unknown",
  resend: "unknown",
  database: "unknown",
};

const sections: Array<"all" | DashboardSectionId> = [
  "all",
  "news",
  "metrics",
  "reports",
  "papers",
  "llmNews",
  "manuals",
];

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ApiStatus>(emptyStatus);
  const [items, setItems] = useState<DashboardItemRow[]>([]);
  const [selectedSection, setSelectedSection] = useState<"all" | DashboardSectionId>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | DashboardItemRow["status"]>("all");
  const [editingItem, setEditingItem] = useState<DashboardItemRow | null>(null);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
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

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const sectionMatches = selectedSection === "all" || item.section === selectedSection;
        const statusMatches = selectedStatus === "all" || item.status === selectedStatus;
        return sectionMatches && statusMatches;
      }),
    [items, selectedSection, selectedStatus],
  );

  const loadItems = useCallback(async () => {
    setIsLoadingItems(true);
    const { data, error } = await db
      .from("dashboard_items")
      .select(
        "id,section,title,description,source_name,source_url,source_kind,published_at,impact,tags,ai_readiness_angle,status,updated_at",
      )
      .order("updated_at", { ascending: false });
    setIsLoadingItems(false);

    if (error) {
      toast({
        title: "No se pudo cargar contenido",
        description:
          "Verifica que la migracion dashboard_items exista en Supabase y que tu usuario @menatech.cloud tenga sesion activa.",
        variant: "destructive",
      });
      return;
    }

    setItems(data ?? []);
  }, [toast]);

  useEffect(() => {
    if (isMenatechUser) {
      loadItems();
    }
  }, [isMenatechUser, loadItems]);

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
      description: data?.persistence?.persisted
        ? `Snapshot publicado con ${data?.data?.items?.length ?? 0} entradas y ${data?.data?.metrics?.length ?? 0} metricas.`
        : `Se obtuvieron ${data?.data?.items?.length ?? 0} entradas, pero revisa persistencia: ${data?.persistence?.errors?.[0] ?? "sin confirmacion"}.`,
    });
    await loadItems();
  };

  const saveItem = async () => {
    if (!editingItem) return;

    setIsSavingItem(true);
    const { data, error } = await db
      .from("dashboard_items")
      .update({
        title: editingItem.title,
        description: editingItem.description,
        source_name: editingItem.source_name,
        source_url: editingItem.source_url,
        source_kind: editingItem.source_kind,
        impact: editingItem.impact,
        tags: editingItem.tags,
        ai_readiness_angle: editingItem.ai_readiness_angle,
        status: editingItem.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingItem.id)
      .select(
        "id,section,title,description,source_name,source_url,source_kind,published_at,impact,tags,ai_readiness_angle,status,updated_at",
      )
      .single();
    setIsSavingItem(false);

    if (error || !data) {
      toast({
        title: "No se pudo guardar",
        description: error?.message ?? "Intenta nuevamente.",
        variant: "destructive",
      });
      return;
    }

    setItems((current) => current.map((item) => (item.id === data.id ? data : item)));
    setEditingItem(data);
    toast({
      title: "Entrada actualizada",
      description: "El cambio quedo guardado en el cache editorial.",
    });
  };

  const updateItemStatus = async (item: DashboardItemRow, nextStatus: DashboardItemRow["status"]) => {
    const { data, error } = await db
      .from("dashboard_items")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", item.id)
      .select(
        "id,section,title,description,source_name,source_url,source_kind,published_at,impact,tags,ai_readiness_angle,status,updated_at",
      )
      .single();

    if (error || !data) {
      toast({
        title: "No se pudo cambiar el estado",
        description: error?.message ?? "Intenta nuevamente.",
        variant: "destructive",
      });
      return;
    }

    setItems((current) => current.map((entry) => (entry.id === data.id ? data : entry)));
    setEditingItem((current) => (current?.id === data.id ? data : current));
  };

  const deleteItem = async (item: DashboardItemRow) => {
    const confirmed = window.confirm(`Eliminar permanentemente "${item.title}"?`);
    if (!confirmed) return;

    const { error } = await db.from("dashboard_items").delete().eq("id", item.id);

    if (error) {
      toast({
        title: "No se pudo eliminar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setEditingItem((current) => (current?.id === item.id ? null : current));
    toast({
      title: "Entrada eliminada",
      description: "La entrada fue removida del cache editorial.",
    });
  };

  if (!session || !isMenatechUser) {
    return <AdminLogin email={email} setEmail={setEmail} isSendingLink={isSendingLink} onSubmit={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Menatech
            </p>
            <h1 className="text-3xl font-black">Panel de control AI Dashboard</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Revisa APIs, refresca datos y cura manualmente el contenido publicado.
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

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <OperationsPanel
            isChecking={isChecking}
            isRefreshing={isRefreshing}
            checkedAt={status.checkedAt}
            onCheckStatus={checkStatus}
            onManualRefresh={manualRefresh}
          />
          <PendingPanel />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ContentList
            items={filteredItems}
            totalItems={items.length}
            selectedSection={selectedSection}
            selectedStatus={selectedStatus}
            isLoading={isLoadingItems}
            onSectionChange={setSelectedSection}
            onStatusChange={setSelectedStatus}
            onReload={loadItems}
            onEdit={setEditingItem}
            onHide={(item) => updateItemStatus(item, "hidden")}
            onRestore={(item) => updateItemStatus(item, "active")}
            onDelete={deleteItem}
          />
          <EditorPanel
            item={editingItem}
            isSaving={isSavingItem}
            onChange={setEditingItem}
            onSave={saveItem}
          />
        </section>
      </div>
    </main>
  );
};

interface AdminLoginProps {
  email: string;
  setEmail: (email: string) => void;
  isSendingLink: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const AdminLogin = ({ email, setEmail, isSendingLink, onSubmit }: AdminLoginProps) => (
  <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-white">
    <form
      onSubmit={onSubmit}
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

interface OperationsPanelProps {
  isChecking: boolean;
  isRefreshing: boolean;
  checkedAt?: string;
  onCheckStatus: () => void;
  onManualRefresh: () => void;
}

const OperationsPanel = ({
  isChecking,
  isRefreshing,
  checkedAt,
  onCheckStatus,
  onManualRefresh,
}: OperationsPanelProps) => (
  <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/10">
    <div className="mb-4 flex items-center gap-3">
      <Database className="h-5 w-5 text-cyan-600" />
      <h2 className="text-xl font-bold">Operaciones</h2>
    </div>
    <div className="flex flex-wrap gap-3">
      <Button onClick={onCheckStatus} disabled={isChecking}>
        {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
        Revisar estado APIs
      </Button>
      <Button onClick={onManualRefresh} disabled={isRefreshing} variant="outline">
        {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Actualizacion manual
      </Button>
    </div>
    {checkedAt && (
      <p className="mt-4 text-sm text-zinc-500">
        Ultima revision:{" "}
        {new Intl.DateTimeFormat("es-PR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(checkedAt))}
      </p>
    )}
  </div>
);

const PendingPanel = () => (
  <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
    <div className="mb-4 flex items-center gap-3 text-orange-800 dark:text-orange-100">
      <AlertTriangle className="h-5 w-5" />
      <h2 className="text-xl font-bold">Pendiente antes de produccion completa</h2>
    </div>
    <ul className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
      <li>Configurar secretos: PERPLEXITY_API_KEY, RESEND_API_KEY, RESEND_FROM y SUPABASE_SERVICE_ROLE_KEY.</li>
      <li>Configurar DASHBOARD_CRON_SECRET para permitir el refresco semanal sin exponer la API.</li>
      <li>Aplicar las migraciones de Supabase para leads, snapshots publicos, cache y auditoria.</li>
      <li>Programar el refresco semanal con Supabase Cron usando el header x-dashboard-cron-secret.</li>
      <li>Conectar dominio recomendado: dashboard.menatech.cloud o menatech.cloud/dashboard_ia.</li>
    </ul>
  </div>
);

interface ContentListProps {
  items: DashboardItemRow[];
  totalItems: number;
  selectedSection: "all" | DashboardSectionId;
  selectedStatus: "all" | DashboardItemRow["status"];
  isLoading: boolean;
  onSectionChange: (section: "all" | DashboardSectionId) => void;
  onStatusChange: (status: "all" | DashboardItemRow["status"]) => void;
  onReload: () => void;
  onEdit: (item: DashboardItemRow) => void;
  onHide: (item: DashboardItemRow) => void;
  onRestore: (item: DashboardItemRow) => void;
  onDelete: (item: DashboardItemRow) => void;
}

const ContentList = ({
  items,
  totalItems,
  selectedSection,
  selectedStatus,
  isLoading,
  onSectionChange,
  onStatusChange,
  onReload,
  onEdit,
  onHide,
  onRestore,
  onDelete,
}: ContentListProps) => (
  <section className="rounded-2xl border border-white/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/10">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold">Contenido editorial</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {items.length} visibles en filtro, {totalItems} entradas cargadas.
        </p>
      </div>
      <Button variant="outline" onClick={onReload} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
        Recargar
      </Button>
    </div>

    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-medium">
        Seccion
        <select
          value={selectedSection}
          onChange={(event) => onSectionChange(event.target.value as "all" | DashboardSectionId)}
          className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
        >
          {sections.map((section) => (
            <option key={section} value={section}>
              {section === "all" ? "Todas" : section}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Estado
        <select
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value as "all" | DashboardItemRow["status"])}
          className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
        >
          <option value="all">Todos</option>
          <option value="active">Activas</option>
          <option value="hidden">Ocultas</option>
          <option value="draft">Borrador</option>
        </select>
      </label>
    </div>

    <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
      {isLoading ? (
        <p className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
          Cargando entradas...
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
          No hay entradas para este filtro. Si es la primera instalacion, aplica la migracion y ejecuta una actualizacion manual.
        </p>
      ) : (
        items.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold dark:bg-white/10">
                {item.section}
              </span>
              <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-700 dark:text-orange-200">
                {item.impact}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold dark:bg-white/10">
                {item.status}
              </span>
            </div>
            <h3 className="font-bold leading-5">{item.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
              {item.description}
            </p>
            <p className="mt-2 truncate text-xs text-zinc-500">{item.source_name}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Editar
              </Button>
              {item.status === "active" ? (
                <Button size="sm" variant="outline" onClick={() => onHide(item)}>
                  <EyeOff className="mr-2 h-3.5 w-3.5" />
                  Ocultar
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => onRestore(item)}>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  Publicar
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => onDelete(item)}>
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Eliminar
              </Button>
            </div>
          </article>
        ))
      )}
    </div>
  </section>
);

interface EditorPanelProps {
  item: DashboardItemRow | null;
  isSaving: boolean;
  onChange: (item: DashboardItemRow | null) => void;
  onSave: () => void;
}

const EditorPanel = ({ item, isSaving, onChange, onSave }: EditorPanelProps) => {
  if (!item) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-6 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Editor</h2>
        <p className="mt-3 text-sm leading-6">
          Selecciona una entrada para ajustar titulo, descripcion, fuente, etiquetas y recomendacion AI Readiness.
        </p>
      </section>
    );
  }

  const updateTags = (value: string) => {
    onChange({
      ...item,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <section className="rounded-2xl border border-white/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Editar entrada</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.id}</p>
        </div>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar
        </Button>
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-medium">
          Estado
          <select
            value={item.status}
            onChange={(event) => onChange({ ...item, status: event.target.value as DashboardItemRow["status"] })}
            className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
          >
            <option value="active">Activa</option>
            <option value="hidden">Oculta</option>
            <option value="draft">Borrador</option>
          </select>
        </label>

        <label className="text-sm font-medium">
          Impacto
          <select
            value={item.impact}
            onChange={(event) => onChange({ ...item, impact: event.target.value as ImpactLevel })}
            className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
          >
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </label>

        <label className="text-sm font-medium">
          Titulo
          <Input value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} className="mt-2" />
        </label>

        <label className="text-sm font-medium">
          Descripcion
          <Textarea
            value={item.description}
            onChange={(event) => onChange({ ...item, description: event.target.value })}
            className="mt-2 min-h-28"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Fuente
            <Input
              value={item.source_name}
              onChange={(event) => onChange({ ...item, source_name: event.target.value })}
              className="mt-2"
            />
          </label>
          <label className="text-sm font-medium">
            Tipo de fuente
            <select
              value={item.source_kind}
              onChange={(event) => onChange({ ...item, source_kind: event.target.value as SourceRef["kind"] })}
              className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <option value="oficial">Oficial</option>
              <option value="academica">Academica</option>
              <option value="consultora">Consultora</option>
              <option value="periodistica">Periodistica</option>
              <option value="gobierno">Gobierno</option>
            </select>
          </label>
        </div>

        <label className="text-sm font-medium">
          URL de fuente
          <Input value={item.source_url} onChange={(event) => onChange({ ...item, source_url: event.target.value })} className="mt-2" />
        </label>

        <label className="text-sm font-medium">
          Etiquetas separadas por coma
          <Input value={item.tags.join(", ")} onChange={(event) => updateTags(event.target.value)} className="mt-2" />
        </label>

        <label className="text-sm font-medium">
          Angulo AI Readiness
          <Textarea
            value={item.ai_readiness_angle}
            onChange={(event) => onChange({ ...item, ai_readiness_angle: event.target.value })}
            className="mt-2 min-h-24"
          />
        </label>
      </div>
    </section>
  );
};

export default Admin;
