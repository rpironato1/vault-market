"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PartnerDashboard from '../features/affiliates/components/PartnerDashboard';

const Partners = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Portal de Parceiros</h1>
          <p className="text-muted-foreground">Monitore o crescimento da sua rede e a performance dos seus convites.</p>
        </header>
        <PartnerDashboard />
      </div>
    </AppLayout>
  );
};

export default Partners;