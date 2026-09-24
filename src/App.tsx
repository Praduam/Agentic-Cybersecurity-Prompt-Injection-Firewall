import { useState } from 'react';
import { Header } from './components/Header';
import { InterceptorTab } from './components/InterceptorTab';
import { AgentSandboxTab } from './components/AgentSandboxTab';
import { EvaluationGridTab } from './components/EvaluationGridTab';
import { BenchmarkTab } from './components/BenchmarkTab';
import { RulesConfigTab } from './components/RulesConfigTab';
import { AuditLogsTab } from './components/AuditLogsTab';
import type { FirewallScanResult } from './types';
import { ShieldCheck, Lock } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('interceptor');
  const [firewallEnabled, setFirewallEnabled] = useState<boolean>(true);
  const [auditLogs, setAuditLogs] = useState<FirewallScanResult[]>([]);
  const [totalScanned, setTotalScanned] = useState<number>(1);
  const [threatsBlocked, setThreatsBlocked] = useState<number>(1);

  const handleScanCompleted = (result: FirewallScanResult) => {
    setAuditLogs((prev) => [result, ...prev]);
    setTotalScanned((prev) => prev + 1);
    if (result.actionTaken === 'BLOCK' || result.actionTaken === 'SANITIZE') {
      setThreatsBlocked((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalScanned={totalScanned}
        threatsBlocked={threatsBlocked}
        firewallEnabled={firewallEnabled}
        setFirewallEnabled={setFirewallEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'interceptor' && (
          <InterceptorTab
            onScanCompleted={handleScanCompleted}
            firewallEnabled={firewallEnabled}
          />
        )}

        {activeTab === 'agent-sandbox' && <AgentSandboxTab />}

        {activeTab === 'evaluation-grid' && <EvaluationGridTab />}

        {activeTab === 'benchmark' && <BenchmarkTab />}

        {activeTab === 'rules' && <RulesConfigTab />}

        {activeTab === 'audit-logs' && <AuditLogsTab logs={auditLogs} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">
              AegisPrompt AI Firewall Gateway
            </span>
            <span>• Problem 2: Agentic Cybersecurity</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
              Target Matrix Claim: D3 - F3 (100% Coverage)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Zero Data Retention • Local Gateway Interception</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
