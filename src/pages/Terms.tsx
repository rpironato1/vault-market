"use client";

import AppLayout from '@/components/layout/AppLayout';

const Terms = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-12 space-y-8 text-zinc-300">
        <h1 className="text-3xl font-black text-white uppercase">Termos de Uso do Protocolo</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-emerald-500">1. Natureza dos Ativos</h2>
          <p>
            O VaultNet é uma plataforma de simulação econômica e gamificação. Os ativos digitais adquiridos (NFTs) e as moedas utilitárias (VaultCoins) 
            não constituem investimentos financeiros, valores mobiliários ou depósitos bancários. 
            Eles são licenciados estritamente para uso dentro do ecossistema de entretenimento.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-emerald-500">2. Aquisição e Recompensas</h2>
          <p>
            Nenhum valor pode ser "depositado" para fins de aposta. Todos os USDTs transferidos destinam-se exclusivamente à compra definitiva de itens colecionáveis. 
            As recompensas obtidas nas experiências são fruto de validação de atividade na rede e podem ser sacadas via rede Polygon, sujeitas a análise de risco.
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default Terms;