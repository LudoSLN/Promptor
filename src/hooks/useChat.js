import { useState, useCallback } from 'react';
import { buildMessages, callAI } from '../lib/ai-providers';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `Hey ! Je suis **Promptor**, ton expert en creation de prompts sur-mesure ! 🎯

Peu importe l'outil IA que tu utilises, je vais t'aider a obtenir **le prompt parfait** — calibre aux bonnes pratiques 2026 de l'outil que tu auras choisi.

Voici notre processus en 3 etapes :

**Etape 1** — Tu me dis ce dont tu as besoin et pour quel outil IA
**Etape 2** — Je cree un premier prompt avec calibrage, auto-critique et questions pour toi
**Etape 3** — Tu reponds a mes questions, j'ameliore le prompt... et on repete jusqu'au **prompt 5 etoiles** ⭐⭐⭐⭐⭐ (3 iterations max)

C'est parti ! Dis-moi :

1. **De quel prompt as-tu besoin et pour atteindre quel objectif ?**
2. **Sur quel outil ou modele d'IA vas-tu copier/coller ce prompt ?**

_(Par exemple : "Un prompt pour rediger des articles de blog SEO, sur ChatGPT" ou "Un prompt pour generer des logos minimalistes, sur Nano Banana")_`,
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState(null);
  const sendMessage = useCallback(async (userMessage, provider, apiKey) => {
    setError(null);
    setIsLoading(true);
    setStreamingContent('');

    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);

    const conversationHistory = [...messages.slice(1), userMsg]
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const builtMessages = buildMessages(conversationHistory, provider);
      const fullText = await callAI(builtMessages, provider, apiKey, (chunk) => {
        setStreamingContent(chunk);
      });

      const assistantMsg = { role: 'assistant', content: fullText };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamingContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const regenerate = useCallback(async (provider, apiKey) => {
    setError(null);
    setStreamingContent('');

    // Find the last user message by removing trailing assistant message(s)
    let trimmed = [...messages];
    while (trimmed.length > 1 && trimmed[trimmed.length - 1].role === 'assistant') {
      trimmed.pop();
    }

    // If we also had a stuck streaming state with no assistant saved, trimmed is already correct
    setMessages(trimmed);
    setIsLoading(true);

    const conversationHistory = trimmed.slice(1)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const builtMessages = buildMessages(conversationHistory, provider);
      const fullText = await callAI(builtMessages, provider, apiKey, (chunk) => {
        setStreamingContent(chunk);
      });

      const assistantMsg = { role: 'assistant', content: fullText };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamingContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const resetChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setStreamingContent('');
    setError(null);
  }, []);

  return { messages, isLoading, streamingContent, error, sendMessage, resetChat, regenerate, setError };
}
