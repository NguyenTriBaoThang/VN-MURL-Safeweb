import React from 'react';
import { Menu, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0f1d]/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            VN-MURL SafeWeb
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </h1>
          <p className="hidden md:block text-xs text-slate-400 font-medium">
            Machine Learning for URL Security & Child-Safe Web Access
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Model priority pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Rule:</span>
          <span className="text-rose-400 font-bold">PHISHING</span>
          <span className="text-slate-500">&gt;</span>
          <span className="text-amber-400 font-bold">ADULT</span>
          <span className="text-slate-500">&gt;</span>
          <span className="text-emerald-400 font-bold">BENIGN</span>
        </div>

        {/* Protection Mode */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Guard</span>
        </div>
      </div>
    </header>
  );
};
