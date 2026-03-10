import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function StreamingMessage({ content }) {
  if (!content) return null;

  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center animate-pulse-glow">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="bg-surface-2 border border-border/50 rounded-2xl px-5 py-4">
          <div className="prose-chat text-[15px] leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
            <span className="inline-block w-2 h-5 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
