import { useState } from 'react';
import { Copy, Check, Sparkles, User, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-lg bg-surface-3/80 hover:bg-surface-4 border border-border/50 text-text-muted hover:text-brand-400 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
      title="Copier"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}

function extractFinalPrompt(content) {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const blocks = content.match(codeBlockRegex);
  if (!blocks || blocks.length === 0) return null;

  const lastBlock = blocks[blocks.length - 1];
  const text = lastBlock.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
  return text.length > 50 ? text : null;
}

function extractRating(content) {
  // Match star emojis: ⭐⭐⭐⭐☆ or ⭐⭐⭐☆☆ patterns
  const starEmojiMatch = content.match(/[⭐★]{1,5}[☆]*/g);
  if (starEmojiMatch) {
    for (const match of starEmojiMatch) {
      const filled = (match.match(/[⭐★]/g) || []).length;
      if (filled >= 1 && filled <= 5) return filled;
    }
  }

  // Match "X/5" patterns like "3/5", "4.5/5", "4/5"
  const numericMatch = content.match(/(\d+(?:[.,]\d+)?)\s*\/\s*5/g);
  if (numericMatch) {
    for (const match of numericMatch) {
      const val = parseFloat(match.replace(',', '.').split('/')[0]);
      if (val >= 1 && val <= 5) return Math.round(val);
    }
  }

  // Match "X étoiles sur 5" or "X étoiles"
  const frenchMatch = content.match(/(\d+(?:[.,]\d+)?)\s*[ée]toiles?\s*(?:sur\s*5)?/i);
  if (frenchMatch) {
    const val = parseFloat(frenchMatch[1].replace(',', '.'));
    if (val >= 1 && val <= 5) return Math.round(val);
  }

  return null;
}

function isFinalFiveStars(content) {
  const rating = extractRating(content);
  const hasFinalMarker = /prompt\s*(5\s*[ée]toiles|final|parfait)|🎯\s*Prompt\s*5/i.test(content);
  return rating === 5 && hasFinalMarker;
}

function hasInterrogatoire(content) {
  return /Partie\s*D|Interrogatoire|💡.*bouton/i.test(content) && !isFinalFiveStars(content);
}

export default function ChatMessage({ message, isStreaming, isLastAssistant, onAutoAnswer, isLoading }) {
  const isAssistant = message.role === 'assistant';
  const finalPrompt = isAssistant ? extractFinalPrompt(message.content) : null;
  const rating = isAssistant ? extractRating(message.content) : null;
  const isFinal = isAssistant ? isFinalFiveStars(message.content) : false;
  const [promptCopied, setPromptCopied] = useState(false);

  const copyPrompt = async () => {
    if (finalPrompt) {
      await navigator.clipboard.writeText(finalPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    }
  };

  const displayRating = rating || 3;
  const showAutoAnswer = isAssistant && isLastAssistant && !isFinal && hasInterrogatoire(message.content) && onAutoAnswer && !isLoading;

  return (
    <div className={`animate-fade-in ${isAssistant ? '' : 'flex justify-end'}`}>
      <div className={`flex gap-3 max-w-[90%] ${isAssistant ? '' : 'flex-row-reverse'}`}>
        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-1 ${
          isAssistant
            ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-500/20'
            : 'bg-surface-3 border border-border'
        }`}>
          {isAssistant ? <Sparkles size={14} className="text-white" /> : <User size={14} className="text-text-dim" />}
        </div>

        <div className={`min-w-0 ${isAssistant ? '' : 'text-right'}`}>
          <div className={`rounded-2xl px-5 py-4 ${
            isAssistant
              ? 'bg-surface-2 border border-border/50'
              : 'bg-brand-600/15 border border-brand-500/20'
          }`}>
            <div className={`prose-chat text-[15px] leading-relaxed ${isAssistant ? '' : 'text-left'}`}>
              <ReactMarkdown
                components={{
                  pre: ({ children, ...props }) => (
                    <div className="relative group">
                      <pre {...props}>{children}</pre>
                      <CopyButton text={
                        typeof children?.props?.children === 'string'
                          ? children.props.children
                          : ''
                      } />
                    </div>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>

          {finalPrompt && !isStreaming && (
            <div className="mt-3 animate-slide-up">
              <div className={`rounded-2xl p-5 relative group border-2 ${
                isFinal
                  ? 'bg-gradient-to-r from-emerald-600/10 to-emerald-800/10 border-emerald-500/40'
                  : 'bg-gradient-to-r from-brand-600/10 to-brand-800/10 border-brand-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className={isFinal ? 'text-emerald-400' : 'text-brand-400'} />
                  <span className={`text-sm font-bold ${isFinal ? 'text-emerald-300' : 'text-brand-300'}`}>
                    {isFinal ? '🎯 Prompt final 5 etoiles !' : `Prompt en cours (${displayRating}/5)`}
                  </span>
                  <div className="flex gap-0.5 ml-2">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-sm ${i <= displayRating ? 'text-yellow-400' : 'text-surface-4'}`}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                {!isFinal && (
                  <p className="text-xs text-text-muted mb-3 italic">
                    Reponds aux questions ci-dessus pour ameliorer ce prompt !
                  </p>
                )}
                <pre className="whitespace-pre-wrap text-sm text-text leading-relaxed font-sans bg-surface/50 rounded-xl p-4 border border-border/50">
                  {finalPrompt}
                </pre>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    onClick={copyPrompt}
                    className={`flex items-center gap-2 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg text-sm ${
                      isFinal
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/35'
                        : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/25 hover:shadow-brand-500/35'
                    }`}
                  >
                    {promptCopied ? (
                      <><Check size={16} /> Copie !</>
                    ) : (
                      <><Copy size={16} /> Copier le prompt</>
                    )}
                  </button>
                  {showAutoAnswer && (
                    <button
                      onClick={onAutoAnswer}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 font-semibold rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wand2 size={16} />
                      Promptor, reponds pour moi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
