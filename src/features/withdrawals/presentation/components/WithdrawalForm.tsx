import React, { useState } from 'react';
import { WithdrawalData } from '../../domain/entities';
import { Wallet, Warning, ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { showSuccess, showError } from '@/utils/toast';
import { IWithdrawalsGateway } from '../../domain/gateway';
import { MockWithdrawalsGateway } from '../../infrastructure/mock.gateway';

interface Props {
  data: WithdrawalData;
  onSuccess: () => void;
}

export const WithdrawalForm = ({ data, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);

    if (val < data.limits.minWithdrawal) {
      showError(`Valor mínimo é $${data.limits.minWithdrawal}`);
      return;
    }
    if (val > data.availableBalance) {
      showError("Saldo insuficiente.");
      return;
    }
    if (!address.startsWith('0x') || address.length < 40) {
      showError("Endereço de carteira inválido.");
      return;
    }

    setIsSubmitting(true);
    try {
      const gateway: IWithdrawalsGateway = new MockWithdrawalsGateway();
      await gateway.requestWithdrawal(val, address);
      showSuccess("Solicitação enviada para análise.");
      setAmount('');
      onSuccess();
    } catch (err) {
      showError("Erro ao processar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Nova Solicitação</h2>
          <p className="text-zinc-400 text-sm mt-1">Transferência via rede Polygon (USDT).</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Disponível</span>
          <div className="text-2xl font-mono font-black text-[#FFD700] tabular-nums">
            ${data.availableBalance.toFixed(2)}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Carteira de Destino (Polygon)</label>
          <div className="relative">
            <input 
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl h-14 px-4 pl-12 text-white font-mono text-sm outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-zinc-700"
              placeholder="0x..."
            />
            <Wallet size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Valor (USDT)</label>
          <div className="relative">
            <input 
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl h-14 px-4 text-white font-mono text-lg font-bold outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-zinc-700"
              placeholder="0.00"
            />
            <button 
              type="button"
              onClick={() => setAmount(data.availableBalance.toString())}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#FFD700] uppercase hover:underline"
            >
              Máximo
            </button>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Min: ${data.limits.minWithdrawal}</span>
            <span>Max: ${data.limits.maxWithdrawal}</span>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-3">
          <Warning className="text-amber-500 shrink-0" size={20} />
          <p className="text-xs text-amber-500/80 leading-relaxed">
            Por medidas de segurança, saques acima de $100 ou contas novas podem passar por revisão manual de até 24h. 
            Certifique-se que o endereço é da rede <strong>Polygon</strong>.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || data.availableBalance < data.limits.minWithdrawal}
          className="w-full h-14 bg-[#FFD700] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#ffdf33] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <CircleNotch className="animate-spin" size={20} />
          ) : (
            <>Solicitar Transferência <ArrowRight weight="bold" size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
};