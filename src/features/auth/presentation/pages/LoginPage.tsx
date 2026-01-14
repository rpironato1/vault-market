import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuthStore } from '../../infrastructure/store';
import { Mail, ArrowRight, Loader2, Lock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginEmail, loginGoogle, isLoading } = useAuthStore();
  
  const [method, setMethod] = useState<'INITIAL' | 'EMAIL'>('INITIAL');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleGoogleLogin = async () => {
    try {
      await loginGoogle();
      showSuccess('Autenticação via Google realizada.');
      navigate('/marketplace');
    } catch (error) {
      showError('Falha na autenticação Google.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {
      await loginEmail(formData.email, formData.password);
      showSuccess('Acesso autorizado. Bem-vindo de volta.');
      navigate('/marketplace');
    } catch (error) {
      showError('Credenciais inválidas ou acesso negado.');
    }
  };

  return (
    <AuthLayout 
      title="Acesso ao Vault" 
      subtitle="Identifique-se para acessar o protocolo."
    >
      <div className="flex flex-col gap-4">
        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="h-12 w-full bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Entrar com Google
            </>
          )}
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#09090b] px-2 text-zinc-500 font-bold tracking-widest">Ou continue com</span>
          </div>
        </div>

        {method === 'INITIAL' ? (
          <button
            onClick={() => setMethod('EMAIL')}
            className="h-12 w-full bg-[#121212] border border-white/10 text-zinc-300 font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 hover:border-white/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Mail size={18} />
            Email Corporativo
          </button>
        ) : (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl h-12 px-4 pl-10 text-white font-medium outline-none focus:border-[#00FF9C]/50 transition-colors"
                  placeholder="nome@exemplo.com"
                  autoFocus
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
                  className="w-full bg-[#121212] border border-white/10 rounded-xl h-12 px-4 pl-10 text-white font-medium outline-none focus:border-[#00FF9C]/50 transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-[#00FF9C] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#00e68d] hover:shadow-[0_0_20px_rgba(0,255,156,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Acessar <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-500">
            Ainda não tem acesso?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-[#00FF9C] font-bold hover:underline decoration-1 underline-offset-4"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;