import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { AI_PROVIDERS } from '../lib/ai-providers';

export default function ChatInput({ onSend, isLoading, provider, hasApiKey }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const providerName = AI_PROVIDERS[provider]?.name || 'IA';

  return (
    <div className="sticky bottom-0 z-40 bg-gradient-to-t from-surface via-surface to-transparent pt-6 pb-4">
      <div className="max-w-4xl mx-auto px-4">
        {!hasApiKey && (
          <div className="mb-3 flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm animate-fade-in">
            <AlertCircle size={16} />
            <span>Configure ta cle API dans les parametres pour commencer</span>
          </div>
        )}
        <div className={`relative bg-surface-2 border rounded-2xl transition-all duration-300 ${
          message ? 'border-brand-500/50 shadow-lg shadow-brand-500/10' : 'border-border'
        }`}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Decris ton besoin... (${providerName})`}
            rows={1}
            className="w-full bg-transparent text-text placeholder-text-muted px-5 py-4 pr-14 resize-none focus:outline-none text-[15px] leading-relaxed"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all duration-200 ${
              message.trim() && !isLoading
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30'
                : 'bg-surface-3 text-text-muted cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[11px] text-text-muted mt-2.5">
          Shift+Entree pour un retour a la ligne &middot; Entree pour envoyer
        </p>
      </div>
    </div>
  );
}
