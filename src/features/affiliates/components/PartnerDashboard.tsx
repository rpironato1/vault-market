"use client";

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Users, TrendingUp, DollarSign, Share2 } from 'lucide-react';

const data = [
  { date: '01/05', value: 400 },
  { date: '02/05', value: 300 },
  { date: '03/05', value: 600 },
  { date: '04/05', value: 800 },
  { date: '05/05', value: 500 },
  { date: '06/05', value: 1100 },
  { date: '07/05', value: 1400 },
];

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="rounded-xl border border-white/5 bg-white/5 p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-emerald-400">+{trend}%</span>
    </div>
    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{title}</p>
    <p className="text-2xl font-mono font-bold mt-1">{value}</p>
  </div>
);

const PartnerDashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Receita de Rede" value="$12,450.00" icon={DollarSign} trend="12.5" />
        <StatCard title="Usuários Ativos" value="1,240" icon={Users} trend="8.2" />
        <StatCard title="Novas Unidades" value="45" icon={TrendingUp} trend="24.1" />
        <button className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/50 transition-colors group">
          <Share2 className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase">Link de Convite</span>
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
        <h3 className="text-lg font-bold mb-6">Performance de Conversão (7 dias)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;