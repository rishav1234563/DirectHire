import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Code2,
} from 'lucide-react';
import { generateZukoResponse, ChatMessage } from '../../services/zukoKnowledge';

export const ZukoChatbot: React.FC<{
  onNavigateTab?: (tab: string) => void;
  onOpenProfile?: () => void;
}> = ({ onNavigateTab, onOpenProfile }) => {
  const { currentUser, studentProfiles, tests } = useApp();

  // STRICT RBAC CHECK: Render Zuko ONLY for job seekers (student role)
  if (!currentUser || currentUser.role !== 'student') {
    return null;
  }

  const profile = studentProfiles[currentUser.id];

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialGreeting: ChatMessage = {
    id: 'zuko-init',
    sender: 'zuko',
    text: `Hi ${currentUser.name.split(' ')[0]}! 🔥 I'm **Zuko**, your personal DirectHire Career & Assessment Coach.

I'm here exclusively for candidates to help you beat benchmark cutoffs, master coding challenges, verify your college credentials, and ace direct recruiter interviews.

How can I help you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const replyText = generateZukoResponse(text, profile, tests);
      const zukoMsg: ChatMessage = {
        id: `zuko-${Date.now()}`,
        sender: 'zuko',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, zukoMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
  };

  const quickPrompts = [
    'How does the ATS-bypass cutoff work?',
    'What happens if I score below the cutoff?',
    'Tips for the Container Port Allocator challenge',
    'How do I verify my college ID?',
    'Mock technical interview question',
  ];

  // Markdown renderer helper
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-amber-900 text-sm mt-1 mb-0.5">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ')) {
            const content = line.replace('- ', '');
            return (
              <div key={idx} className="flex items-start space-x-1.5 ml-1">
                <span className="text-amber-600 font-bold">•</span>
                <span>{renderInlineStyles(content)}</span>
              </div>
            );
          }
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
            return (
              <div key={idx} className="flex items-start space-x-1.5 ml-1 font-medium">
                <span className="text-amber-700 font-mono text-[10px] shrink-0">{line.slice(0, 3)}</span>
                <span>{renderInlineStyles(line.slice(3))}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (line: string) => {
    // Replace **bold** and `code`
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-stone-200/80 font-mono text-[11px] text-amber-900">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Candidate Only) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <button
            id="zuko-chat-trigger"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            title="Open Zuko AI Career Coach (Job Seeker Exclusive)"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-200 fill-amber-300 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-amber-600 rounded-full" />
            </div>

            <div className="text-left pr-1">
              <div className="text-xs font-black tracking-tight flex items-center space-x-1">
                <span>Zuko AI Coach</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-amber-900/50 rounded uppercase font-bold text-amber-200">
                  Candidate
                </span>
              </div>
              <div className="text-[10px] text-amber-100 font-medium">
                Beat the cutoff &bull; Prep tests
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Active Chat Window */}
      {isOpen && (
        <div
          id="zuko-chat-window"
          className={`fixed z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-stone-300 overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'bottom-4 right-4 left-4 sm:left-auto sm:w-[540px] top-16 sm:top-20'
              : 'bottom-6 right-6 w-96 sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Flame className="w-5 h-5 text-amber-200 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">Zuko</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-900/60 text-amber-200 uppercase">
                    Job Seeker Exclusive
                  </span>
                </div>
                <p className="text-[11px] text-amber-100/90 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>AI Assessment & Career Coach</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse Size' : 'Expand Size'}
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors hidden sm:block"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Zuko"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="truncate">
              Candidate: <strong>{currentUser.name}</strong> &bull; {profile?.universityName || 'Emerging University'}
            </span>
            <span className="text-[10px] font-bold text-amber-700 font-mono shrink-0 ml-2">
              ATS-Bypass Active
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'zuko'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-stone-800 text-white'
                  }`}
                >
                  {msg.sender === 'zuko' ? (
                    <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  ) : (
                    <User className="w-4 h-4 text-stone-300" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs'
                  }`}
                >
                  {msg.sender === 'zuko' ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] font-mono ${
                      msg.sender === 'user' ? 'text-amber-200 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-stone-400 text-xs pl-1">
                <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
                </div>
                <div className="flex space-x-1 bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">Zuko is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Carousel */}
          <div className="p-2 bg-white border-t border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="inline-block px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 border border-stone-200 hover:border-amber-300 rounded-full text-[11px] font-medium text-stone-700 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                id="zuko-input-field"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Zuko anything about benchmark cutoffs, code, or prep..."
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                id="zuko-send-button"
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold transition-colors shrink-0 shadow-2xs"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
