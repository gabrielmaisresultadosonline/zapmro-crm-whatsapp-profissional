import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { Lock, Mail, AlertCircle, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CRMLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Sign up with Supabase
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              whatsapp_number: whatsapp
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        if (authData.user) {
          // Create profile in crm_profiles
          const { error: profileError } = await supabase
            .from('crm_profiles')
            .insert({
              user_id: authData.user.id,
              full_name: fullName,
              whatsapp_number: whatsapp,
              role: 'user'
            });
          
          if (profileError) console.error("Error creating profile:", profileError);
        }

        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu e-mail para confirmar a conta (se habilitado).",
        });
        
        // Auto-switch to login after registration success
        setIsRegistering(false);
      } else {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        if (authData.user) {
          // Log access
          await supabase.from('crm_access_logs').insert({
            user_id: authData.user.id,
            user_agent: navigator.userAgent
          });
          
          // Check if admin to redirect correctly
          const { data: profile } = await supabase
            .from('crm_profiles')
            .select('role')
            .eq('user_id', authData.user.id)
            .maybeSingle();

          toast({
            title: "Login realizado!",
            description: "Bem-vindo ao CRM Meta SaaS",
          });

          if (profile?.role === 'super_admin') {
            navigate('/admincentral');
          } else {
            navigate('/crm');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card glow-border p-8 max-w-md w-full animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" />
          <h1 className="text-2xl font-display font-bold mt-4">CRM Meta SaaS</h1>
          <p className="text-muted-foreground text-sm">Gestão Multi-usuário</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-secondary/50"
                  required={isRegistering}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 5551999999999"
                  className="bg-secondary/50"
                  required={isRegistering}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="bg-secondary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="bg-secondary/50"
              required
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : isRegistering ? 'Criar Minha Conta' : 'Entrar no CRM'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-primary hover:underline"
          >
            {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se agora'}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Acesso seguro via Supabase Auth
        </p>
      </div>
    </div>
  );
};

export default CRMLogin;
