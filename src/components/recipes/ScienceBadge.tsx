import { LucideIcon } from 'lucide-react';

interface ScienceBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function ScienceBadge({ icon: Icon, label, value }: ScienceBadgeProps) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
      <div className="bg-white p-2 rounded-md shadow-sm">
        <Icon size={18} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}