import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Settings, User, Zap, DollarSign } from 'lucide-react';

const App = () => {
  // CONFIGURAÇÃO DA IMAGEM
  const logoUrl = "/logo-level5.jpg"; 

  // --- CONFIGURAÇÃO DO WEBHOOK (EASYPANEL) ---
  // AVISO IMPORTANTE: O comando 'import.meta' causa erro na visualização deste chat.
  // QUANDO SUBIR PARA O GITHUB/VPS: Remova as duas barras "//" do início da linha abaixo para ativar a automação:
  
  // const envWebhookUrl = import.meta.env.VITE_WEBHOOK_URL;
  const envWebhookUrl = ""; // Esta linha é apenas um fallback para não dar erro aqui na visualização.
  
  // Configuração da Identidade Visual (TEMA DARK)
  const brandColors = {
    bg: "bg-slate-900", 
    card: "bg-slate-800", 
    primaryButton: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400",
    textMain: "text-slate-100",
    textSecondary: "text-slate-400",
    inputBorder: "border-slate-600 focus:border-yellow-500",
    inputBg: "bg-slate-700",
    headerText: "text-white",
    accentYellow: "text-yellow-400"
  };

  const [webhookUrl, setWebhookUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Se existir variável de ambiente, configura ela automaticamente
  useEffect(() => {
    if (envWebhookUrl) {
      setWebhookUrl(envWebhookUrl);
    }
  }, [envWebhookUrl]);

  const [formData, setFormData] = useState({
    nome: '',
    modulos_quantidade: '',
    especificacoes_modulo: '',
    inversores_quantidade: '',
    especificacoes_inversores: '',
    investimento_kit_fotovoltaico: '',
    investimento_mao_de_obra: ''
  });

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usa a variável de ambiente OU o que foi digitado manualmente
    const targetUrl = envWebhookUrl || webhookUrl || "https://n8n.seu-servidor.com/webhook/test"; 
    
    if (!targetUrl.startsWith('http')) {
      setStatus('error');
      setMessage('URL do Webhook inválida. Verifique as configurações no Easypanel.');
      return;
    }

    setStatus('loading');

    const payload = {
      ...formData,
      modulos_quantidade: Number(formData.modulos_quantidade),
      inversores_quantidade: Number(formData.inversores_quantidade),
      investimento_kit_fotovoltaico: Number(formData.investimento_kit_fotovoltaico),
      investimento_mao_de_obra: Number(formData.investimento_mao_de_obra),
      data_criacao: new Date().toISOString(),
      origem: "Gerador Web Level 5"
    };

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Proposta enviada com sucesso!');
        // Opcional: Limpar formulário
        // setFormData({ nome: '', ... });
      } else {
        throw new Error('Erro de servidor');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Erro de conexão. Verifique se o n8n permite CORS.');
    }
  };

  return (
    <div className={`min-h-screen ${brandColors.bg} font-sans pb-10 flex flex-col selection:bg-yellow-500 selection:text-black`}>
      
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={logoUrl} 
                alt="Level 5 Engenharia" 
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500 shadow-lg bg-slate-800"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/FBBF24/0f172a?text=L5"; }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-extrabold tracking-tight ${brandColors.headerText}`}>
                LEVEL<span className="text-yellow-500">5</span>
              </h1>
              <span className="text-[0.55rem] uppercase tracking-[0.25em] text-yellow-500 font-bold">
                Engenharia Elétrica
              </span>
            </div>
          </div>
          
          {/* Só mostra o ícone de engrenagem se NÃO tiver variável de ambiente configurada */}
          {!envWebhookUrl && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-500 hover:text-yellow-400 transition-colors p-2"
              title="Configurações Manuais"
            >
              <Settings className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 mt-8 flex-grow">
        
        {/* Menu de Configuração Manual (Fallback) */}
        {showSettings && !envWebhookUrl && (
          <div className="w-full bg-slate-800 rounded-lg p-4 mb-6 border border-yellow-500/20 shadow-lg animate-in fade-in slide-in-from-top-2">
            <label className="text-xs text-yellow-500 font-bold uppercase mb-1 block">Webhook URL (Manual)</label>
            <input 
              type="text" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-900 text-slate-200 text-sm p-3 rounded border border-slate-700 focus:border-yellow-500 outline-none"
            />
          </div>
        )}

        <div className={`${brandColors.card} rounded-2xl shadow-2xl border border-slate-700 overflow-hidden`}>
          <div className="bg-slate-800/50 p-8 border-b border-slate-700 text-center">
            <h2 className={`text-2xl font-bold ${brandColors.textMain}`}>Gerador de Propostas</h2>
            <p className={`text-sm ${brandColors.textSecondary} mt-2`}>
              Insira os dados técnicos para gerar a proposta comercial.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Bloco 1: Cliente */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <User className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-wider">Dados do Cliente</h3>
              </div>
              <div className="group">
                <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Nome do Cliente ou Projeto</label>
                <input
                  required
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Residência Marco Antônio"
                  className={`w-full p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`}
                />
              </div>
            </div>

            {/* Bloco 2: Sistema */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-2 pt-6 border-t border-slate-700">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-wider">Sistema Fotovoltaico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Qtd. Módulos</label>
                  <input required type="number" name="modulos_quantidade" value={formData.modulos_quantidade} onChange={handleChange} placeholder="0" className={`w-full p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} />
                </div>
                <div className="md:col-span-8">
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Modelo do Módulo</label>
                  <input required type="text" name="especificacoes_modulo" value={formData.especificacoes_modulo} onChange={handleChange} placeholder="Ex: Jinko 550W" className={`w-full p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} />
                </div>
                <div className="md:col-span-4">
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Qtd. Inversores</label>
                  <input required type="number" name="inversores_quantidade" value={formData.inversores_quantidade} onChange={handleChange} placeholder="0" className={`w-full p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} />
                </div>
                <div className="md:col-span-8">
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Modelo do Inversor</label>
                  <input required type="text" name="especificacoes_inversores" value={formData.especificacoes_inversores} onChange={handleChange} placeholder="Ex: Deye 5kW" className={`w-full p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} />
                </div>
              </div>
            </div>

            {/* Bloco 3: Financeiro */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-2 pt-6 border-t border-slate-700">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-wider">Investimento</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Valor do Kit (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-slate-400 font-bold">R$</span>
                    <input required type="number" step="0.01" name="investimento_kit_fotovoltaico" value={formData.investimento_kit_fotovoltaico} onChange={handleChange} className={`w-full pl-10 p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${brandColors.textMain} mb-2`}>Valor Mão de Obra (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-slate-400 font-bold">R$</span>
                    <input required type="number" step="0.01" name="investimento_mao_de_obra" value={formData.investimento_mao_de_obra} onChange={handleChange} className={`w-full pl-10 p-4 rounded-xl text-white outline-none border transition-all placeholder:text-slate-500 ${brandColors.inputBg} ${brandColors.inputBorder}`} placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button disabled={status === 'loading'} type="submit" className={`w-full py-4 rounded-xl font-bold text-slate-900 text-lg shadow-lg shadow-yellow-500/10 flex justify-center items-center gap-3 transition-all hover:shadow-yellow-500/20 active:scale-[0.98] ${brandColors.primaryButton} disabled:opacity-70 disabled:cursor-not-allowed`}>
                {status === 'loading' ? 'Processando...' : (<>Gerar Proposta <Send className="w-5 h-5" /></>)}
              </button>
            </div>

            {status === 'success' && (<div className="p-4 bg-green-500/10 text-green-400 rounded-xl flex items-center gap-3 border border-green-500/20"><CheckCircle className="w-5 h-5 shrink-0" /><span className="font-medium">{message}</span></div>)}
            {status === 'error' && (<div className="p-4 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-3 border border-red-500/20"><AlertCircle className="w-5 h-5 shrink-0" /><span className="font-medium">{message}</span></div>)}
          </form>
        </div>
        <div className="mt-8 text-center pb-8"><p className="text-slate-500 text-xs">© {new Date().getFullYear()} Level 5 Engenharia Elétrica.</p></div>
      </main>
    </div>
  );
};

export default App;
