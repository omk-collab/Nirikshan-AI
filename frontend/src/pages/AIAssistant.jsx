import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  IndianRupee
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import { projectService } from '../services/projectService';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am the Nirikshan Decision Intelligence Assistant. You can query me about MPLADS portfolio risks, progress gaps, cost deviations, or individual project dossiers.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    async function loadProjects() {
      const res = await projectService.getProjects();
      setAllProjects(res.data || []);
    }
    loadProjects();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const presetQueries = [
    "Show critical projects",
    "Show delayed projects",
    "Show highest cost deviations",
    "Show projects with large progress gaps",
    "Why is project MPLADS-DEMO-001 high risk?",
  ];

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Rule-based query responder engine (Section 39)
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = "";
      let matchedProjects = [];

      if (lower.includes('critical')) {
        matchedProjects = allProjects.filter((p) => p.riskLevel === 'CRITICAL');
        responseText = `I found ${matchedProjects.length} projects currently flagged with Critical Risk (>80 unified risk score). These represent immediate audit priorities.`;
      } else if (lower.includes('delayed')) {
        matchedProjects = allProjects.filter((p) => p.status === 'DELAYED');
        responseText = `There are ${matchedProjects.length} projects currently delayed beyond their scheduled completion milestones.`;
      } else if (lower.includes('cost') || lower.includes('deviation')) {
        matchedProjects = [...allProjects].sort((a, b) => b.costDeviation - a.costDeviation).slice(0, 4);
        responseText = `Here are the projects with the highest percentage cost deviations over baseline tender estimates.`;
      } else if (lower.includes('progress gap') || lower.includes('gap')) {
        matchedProjects = [...allProjects].sort((a, b) => b.progressGap - a.progressGap).slice(0, 4);
        responseText = `Here are the top projects with large Financial vs Physical Progress mismatches, indicating substantial fund drawdown with incomplete civil works.`;
      } else if (lower.includes('demo') || lower.includes('mplads-demo-001')) {
        const demo = allProjects.find((p) => p.projectId === 'MPLADS-DEMO-001') || allProjects[0];
        matchedProjects = [demo];
        responseText = `Project MPLADS-DEMO-001 is evaluated at Risk Score 84 (CRITICAL) due to a 48% progress mismatch (Financial 90% vs Physical 42%), unauthorized cost escalation of +54.2%, and a 120-day timeline delay.`;
      } else {
        matchedProjects = allProjects.slice(0, 3);
        responseText = `Here is a summary of active projects relevant to your query "${query}":`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        projects: matchedProjects,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Decision Support Query Assistant"
        subtitle="Rule-based natural language query interface for rapid risk cross-examination across the MPLADS database."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'AI Assistant' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Query Engine Online
          </span>
        }
      />

      {/* Preset Query Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Quick Inquiries:</span>
        {presetQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-indigo-600/50 text-slate-300 hover:text-white transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[560px] overflow-hidden shadow-2xl">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed text-sm">{msg.text}</p>

                {/* Optional attached project cards */}
                {msg.projects && msg.projects.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.projects.map((p) => (
                      <div
                        key={p.projectId}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{p.projectId}</span>
                            <RiskBadge level={p.riskLevel} size="sm" />
                          </div>
                          <div className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                            {p.projectName}
                          </div>
                        </div>
                        <Link
                          to={`/projects/${p.projectId}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] shrink-0"
                        >
                          Dossier &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block text-right">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 text-xs items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an analytical query (e.g. 'Show critical projects in Maharashtra')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
