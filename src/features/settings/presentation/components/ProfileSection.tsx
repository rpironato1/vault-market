import React from 'react';
import { UserProfile } from '../../domain/entities';
import { User, ShieldCheck, Calendar } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

export const ProfileSection = ({ profile }: Props) => {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
      <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <User size={40} className="text-emerald-500" />
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-zinc-400 text-sm">{profile.email}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{profile.role}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Calendar size={14} className="text-zinc-500" />
            <span className="text-xs font-mono text-zinc-400">
              Membro desde {new Date(profile.joinedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <button className="px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
        Editar Perfil
      </button>
    </div>
  );
};