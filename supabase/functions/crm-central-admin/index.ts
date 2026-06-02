import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "mro@gmail.com";
const ADMIN_PASSWORD = "Ga145523@";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { action, adminEmail, adminPassword } = body as any;

    if (
      (adminEmail || "").toString().trim().toLowerCase() !== ADMIN_EMAIL ||
      (adminPassword || "").toString() !== ADMIN_PASSWORD
    ) {
      return json({ success: false, error: "Credenciais inválidas" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "login") {
      return json({ success: true });
    }

    if (action === "list_users") {
      // Get all auth users (paginated)
      const allUsers: any[] = [];
      let page = 1;
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        allUsers.push(...(data.users || []));
        if (!data.users || data.users.length < 1000) break;
        page++;
        if (page > 20) break;
      }

      const userIds = allUsers.map((u) => u.id);

      const { data: profiles } = await supabase
        .from("crm_profiles")
        .select("user_id, full_name, whatsapp_number, role, created_at")
        .in("user_id", userIds);

      const { data: settings } = await supabase
        .from("crm_settings")
        .select(
          "user_id, meta_phone_number_id, meta_display_phone_number, meta_verified_name, meta_waba_id, meta_access_token"
        )
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      const settingsMap = new Map((settings || []).map((s: any) => [s.user_id, s]));

      const users = allUsers.map((u) => {
        const s: any = settingsMap.get(u.id) || {};
        const p: any = profileMap.get(u.id) || {};
        const connected = !!(s.meta_access_token && s.meta_phone_number_id);
        return {
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          full_name: p.full_name || null,
          whatsapp_profile_number: p.whatsapp_number || null,
          role: p.role || "user",
          meta_display_phone_number: s.meta_display_phone_number || null,
          meta_verified_name: s.meta_verified_name || null,
          meta_phone_number_id: s.meta_phone_number_id || null,
          connected,
        };
      });

      // Sort newest first
      users.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return json({ success: true, users });
    }

    if (action === "user_insights") {
      const { userId } = body as any;
      if (!userId) return json({ success: false, error: "userId obrigatório" }, 400);

      // Total messages
      const { count: totalReceived } = await supabase
        .from("crm_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("direction", "inbound");

      const { count: totalSent } = await supabase
        .from("crm_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("direction", "outbound");

      const { count: totalContacts } = await supabase
        .from("crm_contacts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      // Paid conversations: count distinct contacts that have an outbound message
      // that wasn't a mobile-app echo (only API-sent are billed by Meta).
      const { data: outboundMsgs } = await supabase
        .from("crm_messages")
        .select("contact_id, created_at, metadata")
        .eq("user_id", userId)
        .eq("direction", "outbound")
        .order("created_at", { ascending: true })
        .limit(50000);

      let paidConversations = 0;
      const seenDayContact = new Set<string>();
      for (const m of outboundMsgs || []) {
        const src = (m as any).metadata?.source;
        if (src === "echo_mobile_app" || src === "meta_webhook_echo") continue;
        const day = new Date((m as any).created_at).toISOString().slice(0, 10);
        const key = `${(m as any).contact_id}-${day}`;
        if (seenDayContact.has(key)) continue;
        seenDayContact.add(key);
        paidConversations++;
      }

      return json({
        success: true,
        insights: {
          totalReceived: totalReceived || 0,
          totalSent: totalSent || 0,
          totalContacts: totalContacts || 0,
          paidConversations,
        },
      });
    }

    if (action === "set_password") {
      const { userId, newPassword } = body as any;
      if (!userId || !newPassword || newPassword.length < 6) {
        return json({ success: false, error: "Senha inválida (mínimo 6 caracteres)" }, 400);
      }
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "send_reset_email") {
      const { email, redirectTo } = body as any;
      if (!email) return json({ success: false, error: "Email obrigatório" }, 400);
      const { error } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: redirectTo || undefined },
      });
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "delete_user") {
      const { userId } = body as any;
      if (!userId) return json({ success: false, error: "userId obrigatório" }, 400);

      // Clean dependent data first (FK to auth.users would block)
      await supabase.from("crm_messages").delete().eq("user_id", userId);
      await supabase.from("crm_contacts").delete().eq("user_id", userId);
      await supabase.from("crm_settings").delete().eq("user_id", userId);
      await supabase.from("crm_profiles").delete().eq("user_id", userId);

      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "disconnect_whatsapp") {
      const { userId } = body as any;
      if (!userId) return json({ success: false, error: "userId obrigatório" }, 400);
      const { error } = await supabase
        .from("crm_settings")
        .update({
          meta_access_token: null,
          meta_phone_number_id: null,
          meta_waba_id: null,
          meta_app_id: null,
          meta_app_secret: null,
          meta_display_phone_number: null,
          meta_verified_name: null,
        })
        .eq("user_id", userId);
      if (error) throw error;
      return json({ success: true });
    }

    return json({ success: false, error: "Ação inválida" }, 400);
  } catch (e: any) {
    console.error("[crm-central-admin] error:", e);
    return json({ success: false, error: e.message || "Erro interno" }, 500);
  }
});
