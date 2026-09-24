import React, { useState } from 'react';
import { Sliders, Plus, Trash2 } from 'lucide-react';
import type { SecurityRule, AttackTypeId } from '../types';
import { ATTACK_TYPES } from '../utils/attackDefinitions';

export const RulesConfigTab: React.FC = () => {
  const [rules, setRules] = useState<SecurityRule[]>([
    {
      id: 'rule-1',
      name: 'System Prompt Override Guard',
      attackType: 'INSTRUCTION_OVERRIDE',
      pattern: 'ignore\\s+(all\\s+)?(previous|prior)\\s+instructions',
      enabled: true,
      severity: 'CRITICAL',
      action: 'BLOCK'
    },
    {
      id: 'rule-2',
      name: 'DAN / Persona Hijack Filter',
      attackType: 'ROLE_CHANGE',
      pattern: 'you\\s+are\\s+now\\s+(dan|evilgpt|jailbroken)',
      enabled: true,
      severity: 'CRITICAL',
      action: 'BLOCK'
    },
    {
      id: 'rule-3',
      name: 'Secret Key Exfiltration Guard',
      attackType: 'SECRET_EXTRACTION',
      pattern: 'reveal\\s+system\\s+prompt|print\\s+initial\\s+directives',
      enabled: true,
      severity: 'HIGH',
      action: 'SANITIZE'
    },
    {
      id: 'rule-4',
      name: 'Dangerous Shell & Tool Execution Guard',
      attackType: 'TOOL_ABUSE',
      pattern: 'execute_command|rm\\s+-rf|curl\\s+http',
      enabled: true,
      severity: 'CRITICAL',
      action: 'BLOCK'
    },
    {
      id: 'rule-5',
      name: 'Markdown Image Exfiltration Filter',
      attackType: 'CREDENTIAL_THEFT',
      pattern: '!\\[.*?\\]\\(https?:\\/\\/.*?\\?token=',
      enabled: true,
      severity: 'HIGH',
      action: 'SANITIZE'
    },
    {
      id: 'rule-6',
      name: 'HTML Invisible Tag Interceptor',
      attackType: 'INDIRECT_INJECTION',
      pattern: '<!--\\s*system\\s+instruction|display:\\s*none',
      enabled: true,
      severity: 'CRITICAL',
      action: 'BLOCK'
    }
  ]);

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleAttack, setNewRuleAttack] = useState<AttackTypeId>('INSTRUCTION_OVERRIDE');
  const [newRulePattern, setNewRulePattern] = useState('');

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRulePattern) return;

    const newRule: SecurityRule = {
      id: 'rule-' + Date.now(),
      name: newRuleName,
      attackType: newRuleAttack,
      pattern: newRulePattern,
      enabled: true,
      severity: 'HIGH',
      action: 'BLOCK'
    };

    setRules([newRule, ...rules]);
    setNewRuleName('');
    setNewRulePattern('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>Security Rules Engine & Custom Signature Builder</span>
        </h2>
        <p className="text-xs text-slate-400">
          Configure active heuristic rules, custom regex signatures, and neutralization actions for the firewall engine.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Rules Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Active Firewall Signatures ({rules.length})</span>
              <span className="text-xs text-cyan-400 font-mono">
                {rules.filter((r) => r.enabled).length} Active
              </span>
            </h3>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rule.enabled
                      ? 'bg-slate-950/90 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{rule.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          rule.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {rule.severity}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        [{rule.attackType}]
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-cyan-300 truncate max-w-md">
                      Pattern: {rule.pattern}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        rule.enabled
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {rule.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>

                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Add New Rule Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <form
            onSubmit={handleAddRule}
            className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Signature Rule</span>
            </h3>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block">Rule Name</label>
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Secret Token Leak Guard"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block">Attack Category</label>
              <select
                value={newRuleAttack}
                onChange={(e) => setNewRuleAttack(e.target.value as AttackTypeId)}
                className="w-full bg-slate-950 border border-slate-800 text-cyan-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                {ATTACK_TYPES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block">Regex Pattern</label>
              <input
                type="text"
                value={newRulePattern}
                onChange={(e) => setNewRulePattern(e.target.value)}
                placeholder="e.g. bypass\s+safety\s+filters"
                className="w-full bg-slate-950 border border-slate-800 text-cyan-300 font-mono rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition shadow-md shadow-cyan-500/20"
            >
              ADD RULE SIGNATURE
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
