import { useLayout } from '@/context/LayoutContext';
import { askAI, type ChatMessage, type GraphPayload } from '@/lib/ai';
import { useFlowStore } from '@/store/useFlowStore';
import { useSlots } from '@/store/useSlots';
import { UI_TEXT, NEW_PIPELINE_KEYWORDS, SERVICE_KEYS } from '@/constants/text';
import { Paperclip, Send } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface Props {
  onAIGuidance?: (graph?: GraphPayload, rawText?: string) => void;
}

export interface ChatRef {
  triggerAICall: (prompt: string) => void;
}

// Check if the message indicates a new pipeline request
const isNewPipelineRequest = (message: string) => {
  const lower = message.toLowerCase();
  return NEW_PIPELINE_KEYWORDS.some(keyword => lower.includes(keyword));
};

const Chat = forwardRef<ChatRef, Props>(({ onAIGuidance }, ref) => {
  const { density } = useLayout();
  const resetFlow = useFlowStore((state) => state.resetFlow);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [messages, loading]);

  const handleNewPipeline = useCallback(() => {
    resetFlow();
    setMessages([
      {
        role: 'assistant',
        content: UI_TEXT.CHAT.NEW_PIPELINE_MESSAGE,
      },
    ]);
  }, [resetFlow]);

  const processAIGuidance = useCallback(
    (graph: GraphPayload | undefined, text: string) => {
      if (graph) {
        onAIGuidance?.(graph, text);
      } else if (
        text.toLowerCase().includes('what would you like to connect')
      ) {
        resetFlow();
      }
    },
    [onAIGuidance, resetFlow]
  );

  // Helper function to extract key-value pairs
  const kv = (pattern: string, text: string) => {
    const r = new RegExp(`(?:${pattern})\\s*[:=]\\s*([^\\n,]+)`, 'i');
    const m = text.match(r);
    return m?.[1]?.trim();
  };

  // Helper function to extract arrays of values
  const array = (pattern: string, text: string) => {
    const r = new RegExp(`(?:${pattern})\\s*[:=]\\s*([^\\n]+)`, 'i');
    const m = text.match(r);
    if (!m) return undefined;
    return m[1]
      .split(/[,\s]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  };

  // Parse user input to extract key-value pairs for different services
  const captureSlotsFromText = useCallback((text: string) => {
    const { merge } = useSlots.getState();

    const shopifyData: Record<string, any> = {};
    const snowflakeData: Record<string, any> = {};

    const shopifyKeys = SERVICE_KEYS.SHOPIFY;
    const snowflakeKeys = SERVICE_KEYS.SNOWFLAKE;

    shopifyKeys.forEach((key) => {
      const value = kv(key, text);
      if (value) shopifyData[key] = value;
    });

    snowflakeKeys.forEach((key) => {
      const value = kv(key, text);
      if (value) snowflakeData[key] = value;
    });

    const fields = array('fields', text);
    if (fields) shopifyData.fields = fields;

    merge({
      shopify: shopifyData,
      snowflake: snowflakeData,
    });
  }, []);

  // Initialize with default message only if no prompt is triggered
  useEffect(() => {
    if (!hasInitialized && messages.length === 0) {
      const timer = setTimeout(() => {
        if (!hasInitialized) {
          // Double check to prevent race condition
          setMessages([
            {
              role: 'assistant',
              content: UI_TEXT.CHAT.DEFAULT_MESSAGE,
            },
          ]);
          setHasInitialized(true);
        }
      }, 1000); // Increased delay to allow prompt triggering
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, messages.length]);

  // Expose triggerAICall method to parent component
  useImperativeHandle(
    ref,
    () => ({
      triggerAICall: (prompt: string) => {
        setHasInitialized(true); // Mark as initialized to prevent default message
        setInput(prompt);
        const userMsg = prompt.trim();
        const next = [{ role: 'user', content: userMsg } as const];
        setMessages(next);

        // Parse user-provided details into slots (for fallback synthesis)
        captureSlotsFromText(userMsg);

        setLoading(true);
        askAI(next)
          .then(({ text, graph }) => {
            const newMessage = { role: 'assistant' as const, content: text };
            setMessages((m) => [...m, newMessage]);

            // Process the AI's response
            processAIGuidance(graph, text);
          })
          .catch((e) => {
            console.error('AI Error:', e);
            setMessages((m) => [
              ...m,
              {
                role: 'assistant',
                content: UI_TEXT.CHAT.ERROR_MESSAGE,
              },
            ]);
          })
          .finally(() => {
            setLoading(false);
            setInput('');
          });
      },
    }),
    [messages, captureSlotsFromText, processAIGuidance]
  );

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const next = [...messages, { role: 'user', content: userMsg } as const];
    setMessages(next);
    setInput('');

    // Check if this is a new pipeline request
    if (isNewPipelineRequest(userMsg)) {
      handleNewPipeline();
      return;
    }

    // Parse user-provided details into slots (for fallback synthesis)
    captureSlotsFromText(userMsg);

    setLoading(true);
    try {
      const { text, graph } = await askAI(next);
      const newMessage = { role: 'assistant' as const, content: text };
      setMessages((m) => [...m, newMessage]);

      // Process the AI's response
      processAIGuidance(graph, text);
    } catch (e) {
      console.error('AI Error:', e);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: UI_TEXT.CHAT.ERROR_MESSAGE,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const inputClass = `flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${
    density === 'compact' ? 'text-sm' : 'text-base'
  }`;

  const messageClass = (isUser: boolean) =>
    `max-w-[85%] px-4 py-3 shadow-sm transition-all duration-200 ${
      isUser
        ? 'ml-auto bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-2xl rounded-br-md'
        : 'mr-auto bg-white/80 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl rounded-bl-md backdrop-blur-sm'
    }`;

  const buttonClass = `inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-3 py-2 text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
    density === 'compact' ? 'text-sm' : ''
  }`;

  return (
    <div
      className="flex h-full flex-col min-h-0"
      role="region"
      aria-label="Chat conversation"
    >
      <div
        className={`flex-1 overflow-hidden flex flex-col min-h-0 ${density === 'compact' ? 'p-2' : 'p-4'}`}
      >
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-4 min-h-0"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className="flex w-full"
              role="article"
              aria-label={`${m.role === 'user' ? 'User' : 'AI Assistant'} message`}
            >
              <div className={messageClass(m.role === 'user')}>
                <div className="flex items-start gap-2">
                  {m.role === 'assistant' && (
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium"
                      aria-label={UI_TEXT.COMMON.ACCESSIBILITY.AI_ASSISTANT}
                    >
                      {UI_TEXT.CHAT.AI_LABEL}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {m.content}
                    </p>
                  </div>
                  {m.role === 'user' && (
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-medium"
                      aria-label={UI_TEXT.COMMON.ACCESSIBILITY.USER}
                    >
                      {UI_TEXT.CHAT.USER_LABEL}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div
              className="flex w-full"
              role="status"
              aria-label={UI_TEXT.CHAT.TYPING_INDICATOR}
            >
              <div className="mr-auto bg-white/80 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl rounded-bl-md backdrop-blur-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium"
                    aria-label={UI_TEXT.COMMON.ACCESSIBILITY.AI_ASSISTANT}
                  >
                    {UI_TEXT.CHAT.AI_LABEL}
                  </div>
                  <div
                    className="flex items-center gap-1"
                    aria-label={UI_TEXT.COMMON.ACCESSIBILITY.TYPING_INDICATOR}
                  >
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4 flex-shrink-0" />
        </div>

        <div
          className={`border-t border-zinc-200/60 bg-white/60 p-2 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/40 flex-shrink-0 ${
            density === 'compact' ? 'py-1.5' : 'py-3'
          }`}
          role="form"
          aria-label="Message input form"
        >
          <div className="group flex w-full items-center gap-2 rounded-xl border border-zinc-200/60 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-indigo-500/50 dark:border-zinc-800/60 dark:bg-zinc-950/40">
            <button
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
              aria-label={UI_TEXT.CHAT.ATTACH_FILE}
              tabIndex={0}
            >
              <Paperclip size={18} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={UI_TEXT.CHAT.PLACEHOLDER}
              className={`${inputClass} resize-none outline-none`}
              disabled={loading}
              aria-label={UI_TEXT.CHAT.PLACEHOLDER}
              aria-describedby="chat-instructions"
              rows={1}
              style={{
                minHeight: '2.5rem',
                maxHeight: '8rem',
                outline: 'none',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={send}
              className={`${buttonClass} ${!input.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!input.trim() || loading}
              aria-label={loading ? UI_TEXT.CHAT.SENDING_MESSAGE : UI_TEXT.CHAT.SEND_MESSAGE}
              aria-describedby="send-button-help"
            >
              <Send size={density === 'compact' ? 14 : 16} />
              {density === 'comfortable' && <span className="ml-1">{UI_TEXT.CHAT.SEND_BUTTON}</span>}
            </button>
          </div>
        </div>
        <div id="chat-instructions" className="sr-only">
          {UI_TEXT.CHAT.MESSAGE_INSTRUCTIONS}
        </div>
        <div id="send-button-help" className="sr-only">
          {loading ? UI_TEXT.CHAT.SENDING_HELP : UI_TEXT.CHAT.SEND_BUTTON_HELP}
        </div>
      </div>
    </div>
  );
});

export default Chat;
