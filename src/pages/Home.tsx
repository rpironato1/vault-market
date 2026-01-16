"use client";

import LandingLayout from '@/components/layout/LandingLayout';
import { HeroMarketplace } from '@/features/landing-marketplace/components/HeroMarketplace';
import { BoxGrid } from '@/features/landing-marketplace/components/BoxGrid';
import { RewardModal } from '@/features/landing-marketplace/components/RewardModal';
import { GiftCardSection } from '@/features/gift-cards/components/GiftCardSection';
import { CreditCard, ShieldCheck, GameController } from '@phosphor-icons/react';

const FeatureItem = ({ icon: Icon, title, desc }: any) => (
  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#121212] border border-white/5">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-4">
      <Icon size={24} weight="duotone" />
    </div>
    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">{desc}</p>
  </div>
);

const Home = () => {
  return (
    <LandingLayout>
      <div className="min-h-screen pb-20">
        <HeroMarketplace />
        
        {/* Trust Signals Section */}
        <div className="w-full border-b border-white/5 bg-[#09090b]">
          <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
             <FeatureItem 
               icon={ShieldCheck} 
               title="Valor Garantido" 
               desc="Cada caixa contém ativos com valor superior ao preço de compra." 
             />
             <FeatureItem 
               icon={CreditCard} 
               title="Pagamento Seguro" 
               desc="Processamento criptografado e entrega instantânea de ativos." 
             />
             <FeatureItem 
               icon={GameController} 
               title="Uso Exclusivo" 
               desc="Ativos utilizáveis em todo o ecossistema de jogos da VaultNet." 
             />
          </div>
        </div>

        {/* Nova Seção de Gift Cards */}
        <GiftCardSection />

        {/* Catálogo Original */}
        <BoxGrid />
        
        {/* Components Overlay */}
        <RewardModal />
      </div>
    </LandingLayout>
  );
};

export default Home;