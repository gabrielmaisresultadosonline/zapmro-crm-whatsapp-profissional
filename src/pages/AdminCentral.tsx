import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, LayoutDashboard, MessageSquare, DollarSign, LogOut, Phone, ShieldCheck, Activity } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminCentral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setLoadingStats] = useState({
    totalUsers: 0,
    totalAccesses: 0,
    activeNumbers: 0,
  });
  const [userList, setUserList] = useState<any[]>([]);
  const CONVERSATION_COST = 0.33;

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/crm/login');
        return;
      }

      const { data: profile } = await supabase
        .from('crm_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.role !== 'super_admin') {
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área."
        });
        navigate('/crm');
        return;
      }

      fetchAdminData();
    };

    checkAdmin();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { count: totalUsers } = await supabase.from('crm_profiles').select('*', { count: 'exact', head: true });
      const { count: totalAccesses } = await supabase.from('crm_access_logs').select('*', { count: 'exact', head: true });
      
      const { data: settings } = await supabase
        .from('crm_settings')
        .select('meta_phone_number_id');
      
      const activeNumbers = settings?.filter(s => !!s.meta_phone_number_id).length || 0;

      setLoadingStats({
        totalUsers: totalUsers || 0,
        totalAccesses: totalAccesses || 0,
        activeNumbers: activeNumbers,
      });

      // Fetch user list with profiles and settings
      const { data: profiles } = await supabase
        .from('crm_profiles')
        .select('*, crm_settings(meta_phone_number_id, meta_waba_id)');
      
      // For each user, fetch message stats and calculate costs
      const usersWithStats = await Promise.all((profiles || []).map(async (p) => {
        const { data: msgs } = await supabase
          .from('crm_messages')
          .select('direction, created_at, contact_id')
          .eq('user_id', p.user_id)
          .order('created_at', { ascending: true });

        // Calculate conversation-based cost
        const byContact: Record<string, any[]> = {};
        (msgs || []).forEach((m: any) => {
          if (!m.contact_id) return;
          (byContact[m.contact_id] = byContact[m.contact_id] || []).push(m);
        });

        const DAY = 24 * 60 * 60 * 1000;
        let paidCount = 0;
        
        Object.values(byContact).forEach((contactMsgs) => {
          let lastInbound = -Infinity;
          let lastPaidStart = -Infinity;
          
          for (const m of contactMsgs) {
            const t = new Date(m.created_at).getTime();
            if (m.direction === 'inbound') {
              lastInbound = t;
            } else if (m.direction === 'outbound') {
              const inFreeWindow = t - lastInbound < DAY;
              const inPaidWindow = t - lastPaidStart < DAY;
              if (!inFreeWindow && !inPaidWindow) {
                paidCount++;
                lastPaidStart = t;
              }
            }
          }
        });

        const totalMessages = msgs?.length || 0;
        const totalSent = msgs?.filter(m => m.direction === 'outbound').length || 0;

        return {
          ...p,
          phone: p.crm_settings?.[0]?.meta_phone_number_id || 'Não conectado',
          totalMessages,
          totalSent,
          cost: (paidCount * CONVERSATION_COST).toFixed(2)
        };
      }));

      setUserList(usersWithStats);

    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/crm/login');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-sm font-bold tracking-tighter text-primary">ADMIN CENTRAL</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Painel Administrativo Central
            </h1>
            <p className="text-zinc-400">Visão geral de todos os cadastros e performance do SaaS.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total de Cadastros</p>
                  <p className="text-2xl font-black">{stats.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total de Acessos</p>
                  <p className="text-2xl font-black">{stats.totalAccesses}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Números Conectados</p>
                  <p className="text-2xl font-black">{stats.activeNumbers}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Table */}
          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-lg">Gestão de Usuários</CardTitle>
              <CardDescription>Detalhamento de uso e gastos por conta individual.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Usuário</TableHead>
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">WhatsApp</TableHead>
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">ID do Telefone</TableHead>
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Mensagens</TableHead>
                    <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest text-right">Gasto Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.map((u) => (
                    <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">{u.full_name || 'Sem Nome'}</span>
                          <span className="text-xs text-zinc-500">{u.role === 'super_admin' ? 'Super Admin' : 'Usuário SaaS'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {u.whatsapp_number || 'Não informado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-zinc-500">
                        {u.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3 h-3 text-zinc-400" />
                          <span className="text-sm font-bold">{u.totalMessages}</span>
                          <span className="text-[10px] text-zinc-500">({u.totalSent} enviadas)</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-green-500 font-black">
                          <DollarSign className="w-3 h-3" />
                          R$ {u.cost}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {userList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminCentral;
