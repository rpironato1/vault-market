import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuthStore } from '../../infrastructure/store';
import { Mail, ArrowRight, Loader2, User, Key, Lock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, verifyOtp, isLoading } = useAuthStore();
  
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) return;

    try {
      await register(formData.email, formData.password, formData.name);
      showSuccess('Código de verificação enviado.');
      setStep('OTP');
    } catch (error) {
      showError('Erro ao iniciar cadastro.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    try {
      await verifyOtp(formData.email, otp);
      showSuccess('Conta verificada e ativada.');
      navigate('/marketplace');
    } catch (error) {
      showError('Código inválido ou expirado.');
    }
  };

  return (
    <AuthLayout 
      title={step === 'FORM' ? "Novo Registro" : "Verificação de Segurança"} 
      subtitle={step === 'FORM' ? "Crie sua identidade na rede VaultNet." : "Digite o código enviado ao seu email."}
    >
      {step === 'FORM' ? (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nome de Agente</label>
            <div className="relative">
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface-card border border-white/10 rounded-xl h-12 px-4 pl-10 text-white font-medium outline-none focus:border-accent-emerald/50 transition-colors"
                placeholder="Ex: Neo Anderson"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface-card border border-white/10 rounded-xl h-12 px-4 pl-10 text-white font-medium outline-none focus:border-accent-emerald/50 transition-colors"
                placeholder="nome@exemplo.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <input 
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-surface-card border border-white/10 rounded-xl h-12 px-4 pl-10 text-white font-medium outline-none focus:border-accent-emerald/50 transition-colors"
                placeholder="Crie uma senha forte"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full bg-accent-emerald text-black font-black uppercase tracking-widest rounded-xl hover:bg-accent-emerald-hover hover:shadow-glow-emerald transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight size={18} /></>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
           <div className="flex justify-center my-4">
             <div className="h-16 w-16 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
                <Key className="text-accent-emerald" size={32} />
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 text-center block">Código de 6 dígitos</label>
             <input 
               value={otp}
               onChange={e => {
                 if (e.target.value.length <= 6) setOtp(e.target.value.replace(/\D/g,''));
               }}
               className="w-full bg-surface-card border border-white/10 rounded-xl h-16 text-center text-3xl font-mono font-black text-white outline-none focus:border-accent-emerald transition-all tracking-[0.5em]"
               placeholder="000000"
               autoFocus
             />
             <p className="text-[10px] text-center text-zinc-600 mt-2">Use '123456' para teste.</p>
           </div>

           <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="h-12 w-full bg-accent-emerald text-black font-black uppercase tracking-widest rounded-xl hover:bg-accent-emerald-hover hover:shadow-glow-emerald transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Validar Acesso"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-zinc-500">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-accent-emerald font-bold hover:underline decoration-1 underline-offset-4"
          >
            Fazer login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;