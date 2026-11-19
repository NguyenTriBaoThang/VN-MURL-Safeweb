import React from 'react';
import { FinalLabel, FinalAction } from '../types';
import { CheckCircle2, ShieldAlert, AlertTriangle, ShieldCheck, ShieldX } from 'lucide-react';

interface LabelBadgeProps {
  label: FinalLabel;
  size?: 'sm' | 'md' | 'lg';
}

export const LabelBadge: React.FC<LabelBadgeProps> = ({ label, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm font-semibold',
    lg: 'px-4 py-1.5 text-base font-bold',
  };

  if (label === 'BENIGN') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 ${sizeClasses[size]}`}>
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        BENIGN
      </span>
    );
  }

  if (label === 'PHISHING') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10 ${sizeClasses[size]}`}>
        <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        PHISHING
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10 ${sizeClasses[size]}`}>
      <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ADULT
    </span>
  );
};

interface ActionBadgeProps {
  action: FinalAction;
  size?: 'sm' | 'md' | 'lg';
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm font-semibold',
    lg: 'px-4 py-1.5 text-base font-bold',
  };

  if (action === 'ALLOW') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 uppercase tracking-wide ${sizeClasses[size]}`}>
        <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        ALLOW
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-600/40 uppercase tracking-wide ${sizeClasses[size]}`}>
      <ShieldX className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      BLOCK
    </span>
  );
};
