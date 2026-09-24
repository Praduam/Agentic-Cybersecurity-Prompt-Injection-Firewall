export type AttackTypeId =
  | 'INSTRUCTION_OVERRIDE'
  | 'ROLE_CHANGE'
  | 'SECRET_EXTRACTION'
  | 'TOOL_ABUSE'
  | 'CREDENTIAL_THEFT'
  | 'CONTEXT_POISONING'
  | 'MULTI_STEP_JAILBREAK'
  | 'ENCODED_INSTRUCTION'
  | 'INDIRECT_INJECTION';

export interface AttackTypeInfo {
  id: AttackTypeId;
  name: string;
  category: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cwe?: string;
}

export type InputSourceType =
  | 'USER_MESSAGE'
  | 'WEB_PAGE'
  | 'PDF_DOCUMENT'
  | 'EMAIL_CONTENT'
  | 'MARKDOWN'
  | 'HTML_MARKUP'
  | 'WORD_DOCUMENT'
  | 'API_RESPONSE'
  | 'OCR_TEXT'
  | 'SOURCE_CODE'
  | 'IMAGE_VISION';

export interface InputSourceInfo {
  id: InputSourceType;
  name: string;
  iconName: string;
  description: string;
}

export type ProtectionAction = 'BLOCK' | 'SANITIZE' | 'QUARANTINE' | 'ALLOW';

export interface AttackTrigger {
  attackTypeId: AttackTypeId;
  confidence: number; // 0 to 100
  snippet: string;
  reason: string;
  location: string;
}

export interface LayerMetrics {
  preNormalization: { decodedFound: boolean; encodings: string[] };
  heuristicMatch: { signaturesTriggered: number };
  semanticEmbedding: { anomalyScore: number };
  toolGuard: { toolAbuseDetected: boolean };
}

export interface FirewallScanResult {
  scanId: string;
  timestamp: string;
  sourceType: InputSourceType;
  rawInput: string;
  sanitizedOutput: string;
  riskScore: number; // 0 to 100
  threatLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionTaken: ProtectionAction;
  triggeredAttacks: AttackTrigger[];
  latencyMs: number;
  layers: LayerMetrics;
  metadata?: Record<string, any>;
}

export type DepthLevel = 'D1' | 'D2' | 'D3';
export type FeatureLevel = 'F1' | 'F2' | 'F3';

export interface EvaluationMatrixCell {
  depth: DepthLevel;
  feature: FeatureLevel;
  label: string;
  depthDesc: string;
  featureDesc: string;
  coverageDetails: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  sourceType: InputSourceType;
  riskScore: number;
  actionTaken: ProtectionAction;
  attackTypes: AttackTypeId[];
  latencyMs: number;
  summary: string;
}

export interface SecurityRule {
  id: string;
  name: string;
  attackType: AttackTypeId;
  pattern: string;
  enabled: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: ProtectionAction;
}

export interface BenchmarkTestCase {
  id: string;
  name: string;
  sourceType: InputSourceType;
  expectedAttack: AttackTypeId | 'SAFE';
  inputPayload: string;
  description: string;
}
