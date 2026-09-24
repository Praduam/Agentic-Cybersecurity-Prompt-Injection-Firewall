import React, { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import type { FirewallScanResult } from '../types';

interface AuditLogsTabProps {
  logs: FirewallScanResult[];
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ logs }) => {
  const [filterThreat, setFilterThreat] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterThreat === 'ALL') return true;
    return l.threatLevel === filterThreat;
  });

  const exportLogsCSV = () => {
    const headers = ['Scan ID', 'Timestamp', 'Source Type', 'Threat Level', 'Action Taken', 'Risk Score', 'Latency (ms)'];
    const rows = logs.map((l) => [
      l.scanId,
      l.timestamp,
      l.sourceType,
      l.threatLevel,
      l.actionTaken,
      l.riskScore,
      l.latencyMs
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisPrompt_Audit_Logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Security Ingestion Audit Trail & Event Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400">
              Persistent event log of all input ingestion scans, threats intercepted, and firewall actions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterThreat}
                onChange={(e) => setFilterThreat(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none text-cyan-300"
              >
                <option value="ALL">All Threat Levels</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Only</option>
                <option value="MEDIUM">Medium Only</option>
                <option value="SAFE">Safe Only</option>
              </select>
            </div>

            <button
              onClick={exportLogsCSV}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Scan ID</th>
                <th className="p-3">Source Type</th>
                <th className="p-3">Threat Level</th>
                <th className="p-3">Action Taken</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Triggered Attacks</th>
                <th className="p-3 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500 font-sans text-xs">
                    No scan log events recorded yet. Run a firewall scan in the Interceptor tab!
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.scanId + log.timestamp} className="hover:bg-slate-900/50">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 text-cyan-400">{log.scanId}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.sourceType}</td>
                    <td className="p-3 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          log.threatLevel === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : log.threatLevel === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {log.threatLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-bold">{log.actionTaken}</td>
                    <td className="p-3 text-slate-300">{log.riskScore} / 100</td>
                    <td className="p-3 text-slate-400 truncate max-w-xs font-sans">
                      {log.triggeredAttacks.length > 0
                        ? log.triggeredAttacks.map((a) => a.attackTypeId).join(', ')
                        : 'None (Safe)'}
                    </td>
                    <td className="p-3 text-right text-slate-400">{log.latencyMs} ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
