import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center animate-pulse-glow">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="bg-surface-2 border border-border/50 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
          <span className="text-sm text-text-muted ml-2">Promptor réfléchit...</span>
        </div>
      </div>
    </div>
  );
}
