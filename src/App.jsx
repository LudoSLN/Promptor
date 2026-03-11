import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import StreamingMessage from './components/StreamingMessage';
import Footer from './components/Footer';
import { useChat } from './hooks/useChat';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [provider, setProvider] = useState(() => localStorage.getItem('promptor_provider') || 'claude');
  const [apiKey, setApiKey] = useState(() => {
    const p = localStorage.getItem('promptor_provider') || 'claude';
    return localStorage.getItem(`promptor_key_${p}`) || '';
  });

  const { messages, isLoading, streamingContent, error, sendMessage, resetChat, regenerate, setError } = useChat();
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('promptor_provider', provider);
  }, [provider]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(`promptor_key_${provider}`, apiKey);
    }
  }, [apiKey, provider]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isLoading]);

  const handleSend = (text) => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }
    sendMessage(text, provider, apiKey);
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    const storedKey = localStorage.getItem(`promptor_key_${newProvider}`) || '';
    setApiKey(storedKey);
  };

  const handleAutoAnswer = () => {
    handleSend('Promptor, réponds pour moi selon tes meilleures préconisations.');
  };

  const handleRegenerate = () => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }
    regenerate(provider, apiKey);
  };

  const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
  const lastAssistantIdx = lastAssistantIndex >= 0 ? messages.length - 1 - lastAssistantIndex : -1;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        onReset={resetChat}
        hasMessages={messages.length > 1}
      />

      <SettingsModal
        key={`${provider}:${apiKey}:${settingsOpen ? 'open' : 'closed'}`}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        provider={provider}
        setProvider={handleProviderChange}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isStreaming={false}
              isLastAssistant={i === lastAssistantIdx}
              onAutoAnswer={handleAutoAnswer}
              isLoading={isLoading}
            />
          ))}

          {isLoading && !streamingContent && <TypingIndicator />}

          {streamingContent && <StreamingMessage content={streamingContent} />}

          {error && (
            <div className="flex items-start gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 animate-fade-in">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Oups, une erreur est survenue</p>
                <p className="text-sm mt-1 text-red-300/80">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {!isLoading && messages.length > 1 && messages[messages.length - 1].role !== 'user' && (
            <div className="flex justify-center animate-fade-in">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-brand-400 bg-surface-2 hover:bg-surface-3 border border-border/50 hover:border-brand-500/30 rounded-xl transition-all duration-200"
              >
                <RefreshCw size={14} />
                Regenerer la reponse
              </button>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex justify-center animate-fade-in">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/20 transition-all duration-200"
              >
                <RefreshCw size={15} />
                Reessayer
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        provider={provider}
        hasApiKey={!!apiKey}
      />

      <Footer />
    </div>
  );
}
