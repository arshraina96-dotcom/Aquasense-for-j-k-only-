import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Shield,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { JKDistrict, SupportedLanguage, UnifiedRiskSummary } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrict: JKDistrict;
  riskSummary: UnifiedRiskSummary | null;
  language: SupportedLanguage;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  selectedDistrict,
  riskSummary,
  language
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `Hello! I am your AquaSense Early-Warning Assistant for Jammu & Kashmir. I am currently monitoring live telemetry for ${selectedDistrict.name} District (${selectedDistrict.division} Division). How can I assist your safety today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const quickQuestions = [
    `What is the current flood risk in ${selectedDistrict.name}?`,
    `Are there any active landslide alerts on NH-44 or local mountain slopes?`,
    `What precautions should I take during heavy rainfall?`,
    `Where is the nearest verified relief shelter?`
  ];

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          districtId: selectedDistrict.id,
          language
        })
      });

      if (!res.ok) {
        throw new Error(`Assistant endpoint responded with status ${res.status}`);
      }

      const data = await res.json();
      const replyMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Please follow official local emergency advisories and dial 112 if in danger.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.warn('Assistant error:', err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on verified telemetry for ${selectedDistrict.name} District: The overall multi-hazard risk level is ${riskSummary?.overallRiskLevel || 'Moderate'}. For life safety emergencies, immediately contact Unified Dispatch 112 or local DEOC at 1077.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>AquaSense AI Assistant</span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 border border-cyan-800/80 px-1.5 py-0.2 rounded">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Location: {selectedDistrict.name} ({selectedDistrict.division})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grounding Context Chip */}
      <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Multi-Hazard Status: <strong className="text-cyan-300">{riskSummary?.overallRiskLevel || 'Monitoring'}</strong></span>
        <span>24h Rain: <strong className="text-white font-mono">{riskSummary?.weather.precipitationMm24h ?? 0} mm</strong></span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-sm shadow-sm'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/80 rounded-tl-sm shadow-sm'
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-[10px] text-right mt-1 opacity-70">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start items-center text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing live telemetry &amp; official advisories...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
          Suggested Inquiries
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-left transition-colors truncate max-w-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about flood risk, landslides, shelters..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl transition-colors"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-[10px] text-slate-500 text-center">
          In life-threatening situations, dial 112 directly. Do not wait for chat replies.
        </div>
      </div>

    </div>
  );
};
