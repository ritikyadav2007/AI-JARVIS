import React, { useState, useRef, useEffect } from 'react';
import { playTacticalClick } from '../utils/audioEffects';

export default function AgentOperations({
  messages,
  onSendMessage,
  loading,
  isListening,
  onToggleListening,
  onClearHistory,
}) {
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  }

  const promptChips = [
    'Sir, Veronica pod ka status kya hai?',
    'Report Mark LXXXV armor diagnostics',
    'Deploy Iron Legion in shield formation',
    'Unibeam overdrive activate karo',
    'Scan Point Dume cliffs for anomalies',
    'Clean Slate protocol armed or not?',
  ];

  return (
    <div className="flex flex-col w-full pb-12 gap-space-lg max-w-5xl mx-auto">
      {/* Top Console Card */}
      <div className="bg-surface-container/70 backdrop-blur-xl p-space-md rounded-xl flex items-center justify-between border border-primary-container/20 shadow-lg">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container border border-primary-container/20">
            <span className="material-symbols-outlined text-[28px]">neurology</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary">
              J.A.R.V.I.S. NEURAL AGENT CORE
            </span>
            <span className="font-label-code-xs text-label-code-xs text-secondary tracking-wider">
              HIGH-SECURITY GATEWAY // GEMINI NEURAL INTERFACE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => {
              playTacticalClick();
              onClearHistory();
            }}
            className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-[11px] font-label-code-xs transition-colors cursor-pointer"
          >
            CLEAR CONSOLE
          </button>
        </div>
      </div>

      {/* Suggested Command Chips */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              playTacticalClick();
              onSendMessage(chip);
            }}
            className="px-space-sm py-1 rounded-full bg-surface-container-low hover:bg-primary-container/20 border border-primary-container/30 text-primary-fixed text-[11px] font-label-code-xs transition-all cursor-pointer"
          >
            &gt; {chip}
          </button>
        ))}
      </div>

      {/* Main Conversation Terminal */}
      <div className="bg-surface-container-low/90 backdrop-blur-2xl rounded-xl p-space-md border border-primary-container/30 shadow-2xl flex flex-col h-[520px]">
        {/* Messages List */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-space-md pr-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary-container text-[48px] mb-2 animate-pulse">
                smart_toy
              </span>
              <span className="font-title-sm text-primary text-[17px] mb-1">
                J.A.R.V.I.S. Autonomous Intelligence Standing By
              </span>
              <span className="font-body-sm max-w-md text-on-surface-variant text-[13px]">
                Ask any question, command suit telemetry, or trigger tactical protocols.
                Speaks fluent English, Hindi, and Hinglish. All API connections are strictly secured via backend gateway.
              </span>
            </div>
          ) : (
            messages.map((item, index) => {
              const isUser = item.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
                >
                  <div className="flex items-center gap-1 font-label-code-xs text-[10px] text-on-surface-variant px-1">
                    <span className={isUser ? 'text-secondary' : 'text-primary'}>
                      {isUser ? 'TONY STARK' : 'J.A.R.V.I.S.'}
                    </span>
                    <span>•</span>
                    <span>{item.timestamp || 'SYNCED'}</span>
                  </div>

                  <div
                    className={`max-w-[80%] p-space-sm rounded-xl font-body-md text-[13px] leading-relaxed ${
                      isUser
                        ? 'bg-secondary-container/20 text-on-surface border border-secondary/40'
                        : 'bg-surface-container-high/80 text-primary border border-primary-container/30'
                    }`}
                  >
                    {item.text}
                  </div>

                  {item.action && (
                    <div className="flex items-center gap-1 font-label-code-xs text-[10px] text-primary-fixed-dim bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                      <span className="material-symbols-outlined text-[12px]">flash_on</span>
                      <span>TACTICAL TRIGGER: {item.action.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-center gap-2 text-primary font-label-code-xs text-[12px] p-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
              <span>J.A.R.V.I.S. is synthesizing neural directive...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-space-xs pt-space-sm border-t border-surface-container-highest/60 mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type command or question (e.g. 'Sir, Veronica ko activate karo')..."
            disabled={loading}
            className="flex-1 bg-surface-container/60 border border-primary-container/20 rounded-lg px-space-md py-space-sm text-on-surface placeholder:text-outline text-[13px] font-body-md focus:outline-none focus:border-primary-container"
          />

          <button
            type="button"
            onClick={() => {
              playTacticalClick();
              onToggleListening();
            }}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              isListening
                ? 'bg-primary-container text-on-primary-container border-primary-container animate-pulse shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-surface-container-high text-primary border-surface-container-highest hover:bg-surface-container-highest'
            }`}
            title="Toggle Mic"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-code-xs font-bold hover:shadow-[0_0_15px_rgba(0,240,255,0.7)] disabled:opacity-30 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>TRANSMIT</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

