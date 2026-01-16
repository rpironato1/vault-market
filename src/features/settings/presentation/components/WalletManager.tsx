import { useState } from 'react';
import { LinkedWallet } from '../../domain/entities';
import { Wallet, Plus, Trash, CheckCircle, Star } from 'lucide-react';
import { MockSettingsGateway } from '../../infrastructure/mock.gateway';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface Props {
  wallets: LinkedWallet[];
  onUpdate: () => void;
}

export const WalletManager = ({ wallets, onUpdate }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gateway = new MockSettingsGateway(); // Em prod, injetar via hook/context

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.startsWith('0x') || newAddress.length < 40) {
      showError("Endereço inválido.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await gateway.addWallet(newAddress, newLabel || 'Nova Carteira');
      showSuccess("Carteira vinculada com sucesso.");
      setIsAdding(false);
      setNewAddress('');
      setNewLabel('');
      onUpdate();
    } catch (err) {
      showError("Erro ao vincular carteira.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await gateway.setDefaultWallet(id);
      showSuccess("Carteira padrão atualizada.");
      onUpdate();
    } catch (err) {
      showError("Erro ao atualizar.");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remover esta carteira?")) return;
    try {
      await gateway.removeWallet(id);
      showSuccess("Carteira removida.");
      onUpdate();
    } catch (err) {
      showError("Erro ao remover.");
    }
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Carteiras Conectadas</h3>
          <p className="text-sm text-zinc-400">Gerencie endereços para recebimento de prêmios (USDT Polygon).</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Endereço (Polygon)</label>
              <input 
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Rótulo (Opcional)</label>
              <input 
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Ex: Metamask Pessoal"
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 disabled:opacity-50"
            >
              {isSubmitting ? 'Verificando...' : 'Vincular Carteira'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {wallets.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
            Nenhuma carteira vinculada.
          </div>
        ) : (
          wallets.map(wallet => (
            <div key={wallet.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  wallet.isDefault ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-white/5 text-zinc-500"
                )}>
                  <Wallet size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{wallet.label}</span>
                    {wallet.isDefault && (
                      <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded border border-[#FFD700]/20 font-black uppercase tracking-wider">
                        Padrão
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                    {wallet.address}
                    <span className="text-emerald-500 flex items-center gap-1 text-[9px] font-bold uppercase bg-emerald-500/5 px-1 rounded">
                      <CheckCircle size={10} /> Verificada
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!wallet.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(wallet.id)}
                    title="Definir como padrão"
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-[#FFD700] transition-colors"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleRemove(wallet.id)}
                  title="Remover carteira"
                  className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};