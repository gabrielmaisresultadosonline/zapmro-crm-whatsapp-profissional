 import { Check, MessageCircle, ShieldCheck, Zap, BarChart3, Bot, Clock, Users, ArrowRight, Star } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Logo } from "@/components/Logo";
 import { Link } from "react-router-dom";
 
 const Sales = () => {
   const features = [
     {
       icon: <MessageCircle className="w-6 h-6 text-green-500" />,
       title: "API Oficial Meta",
       description: "Conecte-se diretamente com a infraestrutura oficial do WhatsApp para maior estabilidade e segurança."
     },
     {
       icon: <Bot className="w-6 h-6 text-green-500" />,
       title: "Agente de IA",
       description: "Automação inteligente com GPT para responder seus clientes 24/7 de forma humanizada."
     },
     {
       icon: <Zap className="w-6 h-6 text-green-500" />,
       title: "Fluxos de Automação",
       description: "Crie sequências de mensagens e funis de vendas complexos de forma visual e intuitiva."
     },
     {
       icon: <BarChart3 className="w-6 h-6 text-green-500" />,
       title: "Métricas Detalhadas",
       description: "Acompanhe conversas pagas, ativas e o ROI de suas campanhas em tempo real."
     },
     {
       icon: <Users className="w-6 h-6 text-green-500" />,
       title: "Gestão de Contatos",
       description: "CRM completo com Kanban, tags e sincronização automática com Google Contacts."
     },
     {
       icon: <Clock className="w-6 h-6 text-green-500" />,
       title: "Agendamentos",
       description: "Programe envios em massa ou individuais para datas e horários específicos."
     }
   ];
 
   const brands = ["Claro", "Vivo", "Magazine Luiza", "Benoit"];
 
   return (
     <div className="min-h-screen bg-white font-sans text-slate-900">
       {/* Header */}
       <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="bg-[#050508] p-2 rounded-xl">
             <Logo size="sm" />
           </div>
           <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
             <a href="#funcionalidades" className="hover:text-green-600 transition-colors">Funcionalidades</a>
             <a href="#precos" className="hover:text-green-600 transition-colors">Preços</a>
             <a href="#seguranca" className="hover:text-green-600 transition-colors">Segurança</a>
           </nav>
           <Link to="/crm/login">
             <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
               Entrar no CRM
             </Button>
           </Link>
         </div>
       </header>
 
       {/* Hero Section */}
       <section className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white">
         <div className="container mx-auto px-4 text-center">
           <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1">
             🚀 API Oficial WhatsApp Business
           </Badge>
           <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
             Não perca nunca mais seu WhatsApp! Utilize agora <span className="text-green-600">API META Whatsapp</span>.
           </h1>
           <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
             Atenda seus clientes de forma profissional, automatize suas vendas e tenha a segurança de uma conexão oficial sem riscos de bloqueio.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/crm/login?mode=register">
               <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-2xl w-full sm:w-auto shadow-lg shadow-green-200 group">
                 Cadastrar Grátis no CRM
                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
             </Link>
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <ShieldCheck className="w-5 h-5 text-green-600" />
               Sem cartão de crédito necessário
             </div>
           </div>
 
           {/* Floating elements/images placeholder */}
           <div className="mt-16 relative max-w-5xl mx-auto">
             <div className="aspect-video bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent"></div>
               <img 
                 src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=2000" 
                 alt="WhatsApp CRM Interface" 
                 className="w-full h-full object-cover opacity-90"
               />
               <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between flex-wrap gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                     <MessageCircle className="text-white w-6 h-6" />
                   </div>
                   <div className="text-left">
                     <div className="font-bold">Chat Multi-agente</div>
                     <div className="text-sm text-slate-500">Gerencie todas conversas em um só lugar</div>
                   </div>
                 </div>
                 <div className="flex -space-x-3">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="rounded-full" alt="User" />
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Brands */}
       <section className="py-12 border-y border-slate-100 bg-slate-50/50">
         <div className="container mx-auto px-4">
           <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
             Utilizado pelas maiores marcas do mercado
           </p>
           <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
             {brands.map(brand => (
               <span key={brand} className="text-2xl font-bold text-slate-700">{brand}</span>
             ))}
           </div>
         </div>
       </section>
 
       {/* Features */}
       <section id="funcionalidades" className="py-24">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que você precisa para dominar o WhatsApp</h2>
             <p className="text-slate-600 max-w-2xl mx-auto">
               Se destaque como empresa e atenda seu cliente de forma mais profissional sem preocupação de perda de números.
             </p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {features.map((feature, i) => (
               <div key={i} className="p-8 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
                 <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {feature.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                 <p className="text-slate-600">{feature.description}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Pricing */}
       <section id="precos" className="py-24 bg-slate-50">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos que cabem no seu bolso</h2>
             <p className="text-slate-600">Escolha o plano ideal para a escala do seu negócio</p>
           </div>
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Monthly */}
             <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
               <CardHeader className="p-8 text-center pb-0">
                 <CardTitle className="text-2xl">Mensal</CardTitle>
                 <CardDescription>Para quem está começando</CardDescription>
                 <div className="mt-6">
                   <span className="text-4xl font-bold">R$ 147</span>
                   <span className="text-slate-500 ml-2">/mês</span>
                 </div>
               </CardHeader>
               <CardContent className="p-8">
                 <ul className="space-y-4">
                   {["API Oficial Meta", "Dashboard Completo", "Agente de IA", "Kanban CRM", "Suporte Prioritário"].map(item => (
                     <li key={item} className="flex items-center gap-3">
                       <Check className="w-5 h-5 text-green-500 shrink-0" />
                       <span className="text-slate-600">{item}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
               <CardFooter className="p-8 pt-0">
                 <Link to="/crm/login?mode=register" className="w-full">
                   <Button variant="outline" className="w-full py-6 rounded-xl border-green-600 text-green-600 hover:bg-green-50">
                     Começar Agora
                   </Button>
                 </Link>
               </CardFooter>
             </Card>
 
             {/* Annual */}
              <Card className="rounded-3xl border-green-500 overflow-hidden shadow-2xl relative scale-105 z-10 bg-white text-slate-900">
               <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                 Mais Popular - Economize 77%
               </div>
               <CardHeader className="p-8 text-center pb-0">
                  <CardTitle className="text-2xl text-slate-900">Anual</CardTitle>
                 <CardDescription>O melhor custo-benefício</CardDescription>
                 <div className="mt-6">
                   <span className="text-sm text-slate-500 block line-through">R$ 1.764 /ano</span>
                   <span className="text-4xl font-bold text-green-600">R$ 397</span>
                   <span className="text-slate-500 ml-2">/ano</span>
                 </div>
                 <p className="mt-2 text-sm font-medium text-green-700 bg-green-50 py-2 rounded-lg">
                   Ou em até 12x de <span className="text-lg font-bold">R$ 41</span>
                 </p>
               </CardHeader>
               <CardContent className="p-8">
                 <ul className="space-y-4">
                   {["Tudo do plano Mensal", "Economia Gigante", "Treinamento VIP", "Prioridade em Novidades", "Selos de Verificação"].map(item => (
                     <li key={item} className="flex items-center gap-3">
                       <Check className="w-5 h-5 text-green-500 shrink-0" />
                       <span className="text-slate-700 font-medium">{item}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
               <CardFooter className="p-8 pt-0">
                 <Link to="/crm/login?mode=register" className="w-full">
                   <Button className="w-full py-6 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
                     Assinar Plano Anual
                   </Button>
                 </Link>
               </CardFooter>
             </Card>
           </div>
         </div>
       </section>
 
       {/* Security/Meta Integration */}
       <section id="seguranca" className="py-24">
         <div className="container mx-auto px-4">
           <div className="bg-[#050508] text-white rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 blur-[120px] rounded-full"></div>
             <div className="lg:w-1/2 relative z-10">
               <Badge className="mb-4 bg-green-600/20 text-green-400 hover:bg-green-600/20 border-green-600/30">Segurança Total</Badge>
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Integração Direta com a Meta</h2>
               <p className="text-slate-400 text-lg mb-8">
                 Ao contrário de extensões de navegador ou APIs não-oficiais que podem banir seu número a qualquer momento, nosso CRM utiliza a infraestrutura em nuvem da própria Meta.
               </p>
               <div className="grid grid-cols-2 gap-6">
                 <div className="flex items-start gap-3">
                   <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                   <div>
                     <div className="font-bold">Sem Banimentos</div>
                     <div className="text-sm text-slate-500">Conexão via Business API</div>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                   <Zap className="w-6 h-6 text-green-500 shrink-0" />
                   <div>
                     <div className="font-bold">Rapidez</div>
                     <div className="text-sm text-slate-500">Mensagens entregues na hora</div>
                   </div>
                 </div>
               </div>
             </div>
             <div className="lg:w-1/2 flex justify-center">
               <div className="relative">
                 <div className="absolute -inset-4 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
                 <div className="bg-white/10 backdrop-blur-xl p-8 rounded-full border border-white/10">
                   <img 
                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                     alt="WhatsApp" 
                     className="w-32 h-32 md:w-48 md:h-48"
                   />
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Footer */}
       <footer className="py-12 border-t border-slate-100">
         <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="bg-[#050508] p-2 rounded-xl">
               <Logo size="sm" />
             </div>
             <div className="text-slate-400 text-sm">
               © 2026 I.A MRO. Todos os direitos reservados. 
               <span className="mx-2">|</span>
               Plataforma de Automação de WhatsApp.
             </div>
             <div className="flex gap-6">
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
             </div>
           </div>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Sales;