import React from 'react';
import {
  Shield,
  ShieldCheck,
  Cpu,
  Grid,
  Zap,
  Sliders,
  FileText,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalScanned: number;
  threatsBlocked: number;
  firewallEnabled: boolean;
  setFirewallEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalScanned,
  threatsBlocked,
  firewallEnabled,
  setFirewallEnabled
}) => {
  const tabs = [
    { id: 'interceptor', name: 'Live Firewall Interceptor', icon: Shield },
    { id: 'agent-sandbox', name: 'AI Agent Sandbox', icon: Cpu },
    { id: 'evaluation-grid', name: '3x3 Evaluation Matrix', icon: Grid },
    { id: 'benchmark', name: 'Automated Benchmark Suite', icon: Zap },
    { id: 'rules', name: 'Rules Engine Config', icon: Sliders },
    { id: 'audit-logs', name: 'Security Audit Logs', icon: FileText }
  ];

  const blockRate = totalScanned > 0 ? Math.round((threatsBlocked / totalScanned) * 100) : 100;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  AegisPrompt <span className="cyber-gradient-text">AI Firewall</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  D3-F3 Target
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agentic Cybersecurity • Multimodal Prompt Injection Defense Engine
              </p>
            </div>
          </div>

          {/* Real-time Telemetry & Protection Switch */}
          <div className="flex items-center flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-4 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
              <div className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Total Scans:</span>
                <span className="font-mono font-bold text-white">{totalScanned}</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-400">Blocked:</span>
                <span className="font-mono font-bold text-rose-400">{threatsBlocked}</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Block Rate:</span>
                <span className="font-mono font-bold text-emerald-400">{blockRate}%</span>
              </div>
            </div>

            {/* Firewall Toggle Switch */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
              <span className="text-slate-300 font-medium">Firewall Protection:</span>
              <button
                onClick={() => setFirewallEnabled(!firewallEnabled)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  firewallEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    firewallEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={`font-mono font-bold uppercase text-[10px] px-1.5 py-0.5 rounded ${
                  firewallEnabled
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {firewallEnabled ? 'ACTIVE' : 'BYPASSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
