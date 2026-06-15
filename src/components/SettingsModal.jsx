import { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Key, Shield } from 'lucide-react';
import { AI_PROVIDERS, sanitizeApiKey } from '../lib/ai-providers';

export default function SettingsModal({ isOpen, onClose, provider, setProvider, apiKey, setApiKey }) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanedApiKey = sanitizeApiKey(localKey);
    setLocalKey(cleanedApiKey);
    setApiKey(cleanedApiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProviderSelect = (id) => {
    setProvider(id);
    const storedKey = sanitizeApiKey(localStorage.getItem(`promptor_key_${id}`) || '');
    setLocalKey(storedKey);
    setApiKey(storedKey);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-surface-2 border border-border rounded-2xl shadow-2xl animate-fade-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold">Parametres</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-3 text-text-muted hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-2">
          <label className="text-sm font-semibold text-text-dim mb-3 block flex items-center gap-2">
            <span>Choisis ton IA</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(AI_PROVIDERS).map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderSelect(p.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                  provider === p.id
                    ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                    : 'border-border hover:border-surface-4 bg-surface-3/50 hover:bg-surface-3'
                }`}
              >
                <span className="text-2xl block mb-2">{p.icon}</span>
                <span className="text-sm font-semibold block">{p.name}</span>
                <span className="text-[11px] text-text-muted block mt-0.5">{p.company}</span>
                {provider === p.id && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          <label className="text-sm font-semibold text-text-dim mb-2 block flex items-center gap-2">
            <Key size={14} />
            <span>Cle API {AI_PROVIDERS[provider]?.name}</span>
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={`Colle ta clé API ${AI_PROVIDERS[provider]?.company} ici...`}
              className="w-full bg-surface-3 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text placeholder-text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Shield size={12} className="text-brand-400" />
            <p className="text-[11px] text-text-muted">
              Ta cle est stockee uniquement dans ton navigateur. Jamais transmise a nos serveurs.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle size={16} />
                Sauvegarde !
              </>
            ) : (
              'Sauvegarder'
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-surface-3 hover:bg-surface-4 text-text-dim hover:text-text font-medium rounded-xl transition-all duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
