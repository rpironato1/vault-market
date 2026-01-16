import { Ticket, Info } from '@phosphor-icons/react';
import { GiftBoxCard } from './GiftBoxCard';
import { GiftRevealModal } from './GiftRevealModal';
import { GIFT_TIERS } from '../domain/entities';
import { useGiftCardStore } from '../infrastructure/store';
import { useStore } from '@infra/state/store';
import { showSuccess, showError } from '@/utils/toast';

export const GiftCardSection = () => {
  const { openGiftBox, isOpening } = useGiftCardStore();
  const { balance } = useStore();

  const handlePurchase = async (tier: typeof GIFT_TIERS[0]) => {
    if (balance < tier.price) {
      showError("Saldo insuficiente para esta caixa.");
      return;
    }
    
    try {
      await openGiftBox(tier.id);
      showSuccess("Caixa aberta com sucesso!");
    } catch (e) {
      showError("Erro ao processar transação.");
    }
  };

  return (
    <section className="w-full py-16 px-6 md:px-8 bg-[#09090b] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Ticket size={20} className="text-emerald-500" weight="duotone" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                Cashback & Rewards
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Gift Cards <span className="text-zinc-500">&</span> Game Coins
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Adquira pacotes com retorno financeiro garantido. Cada caixa contém um Gift Card de uma grande marca 
              mais um bônus em moedas da plataforma. <span className="text-white">Você nunca perde valor.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
             <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-[#FF9900] border-2 border-[#121212]" title="Amazon" />
                <div className="h-6 w-6 rounded-full bg-white border-2 border-[#121212]" title="Apple" />
                <div className="h-6 w-6 rounded-full bg-[#1DB954] border-2 border-[#121212]" title="Spotify" />
                <div className="h-6 w-6 rounded-full bg-[#E60012] border-2 border-[#121212]" title="Netflix" />
             </div>
             <span className="text-xs font-bold text-zinc-400 pl-2 border-l border-white/10">
               +14 Parceiros Oficiais
             </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {GIFT_TIERS.map(tier => (
            <GiftBoxCard 
              key={tier.id} 
              tier={tier} 
              onSelect={handlePurchase}
              disabled={isOpening}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600">
           <Info size={14} />
           <p className="text-[10px] font-bold uppercase tracking-wider">
             O valor total (Gift Card + Moedas) é sempre superior ao preço de entrada.
           </p>
        </div>
      </div>

      <GiftRevealModal />
    </section>
  );
};