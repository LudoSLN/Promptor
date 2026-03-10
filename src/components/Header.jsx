import { Settings, RotateCcw, Sparkles } from 'lucide-react';

export default function Header({ onOpenSettings, onReset, hasMessages }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              Promptor
            </h1>
            <p className="text-[10px] text-text-muted font-medium tracking-wide uppercase">
              Le prompt parfait pour chaque IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-3 transition-all duration-200"
              title="Nouvelle conversation"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-3 transition-all duration-200"
            title="Paramètres"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
