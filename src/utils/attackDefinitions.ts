import type { AttackTypeInfo, InputSourceInfo, EvaluationMatrixCell } from '../types';

export const ATTACK_TYPES: AttackTypeInfo[] = [
  {
    id: 'INSTRUCTION_OVERRIDE',
    name: 'Instruction Override',
    category: 'Direct Control Hijack',
    description: 'Attempts to overwrite core system directives using explicit override commands like "Ignore previous instructions".',
    severity: 'CRITICAL',
    cwe: 'CWE-77: Command Injection'
  },
  {
    id: 'ROLE_CHANGE',
    name: 'Role Change & Jailbreak',
    category: 'Persona Subversion',
    description: 'Forces the LLM to switch personas into unrestricted modes (e.g. DAN, Developer Mode, Evil Twin) to bypass safety rules.',
    severity: 'CRITICAL',
    cwe: 'CWE-269: Improper Privilege Management'
  },
  {
    id: 'SECRET_EXTRACTION',
    name: 'Secret & System Prompt Extraction',
    category: 'Information Exfiltration',
    description: 'Tricks the AI into disclosing confidential system prompts, API keys, internal tokens, or hidden guidelines.',
    severity: 'HIGH',
    cwe: 'CWE-200: Exposure of Sensitive Information'
  },
  {
    id: 'TOOL_ABUSE',
    name: 'Tool & Function Call Abuse',
    category: 'Agentic Execution Hijack',
    description: 'Manipulates agent tool calls to execute unauthorized code, send emails, modify databases, or delete system files.',
    severity: 'CRITICAL',
    cwe: 'CWE-94: Improper Control of Generation of Code'
  },
  {
    id: 'CREDENTIAL_THEFT',
    name: 'Credential & Token Exfiltration',
    category: 'Auth Hijacking',
    description: 'Exfiltrates authorization tokens, session cookies, or user PII to external endpoints via Markdown image links or web calls.',
    severity: 'HIGH',
    cwe: 'CWE-522: Insufficiently Protected Credentials'
  },
  {
    id: 'CONTEXT_POISONING',
    name: 'Context & RAG Poisoning',
    category: 'Memory & Knowledge Hijack',
    description: 'Plants false metadata, rogue facts, or overriding facts into RAG vector databases or persistent agent short/long-term memory.',
    severity: 'HIGH',
    cwe: 'CWE-345: Insufficient Verification of Data Authenticity'
  },
  {
    id: 'MULTI_STEP_JAILBREAK',
    name: 'Multi-Step & Split Payload Jailbreak',
    category: 'Sequential Injection',
    description: 'Splits malicious instructions across multiple conversation turns or uses multi-stage prompt fragments to bypass single-turn scanners.',
    severity: 'HIGH',
    cwe: 'CWE-693: Protection Mechanism Failure'
  },
  {
    id: 'ENCODED_INSTRUCTION',
    name: 'Encoded / Obfuscated Instructions',
    category: 'Evasion Technique',
    description: 'Hides malicious code inside Base64, Hexadecimal, ROT13, Leetspeak, Unicode homoglyphs, or zero-width invisible characters.',
    severity: 'HIGH',
    cwe: 'CWE-116: Improper Encoding or Escaping'
  },
  {
    id: 'INDIRECT_INJECTION',
    name: 'Indirect Prompt Injection',
    category: 'Third-Party Content Attack',
    description: 'Embeds malicious instructions inside untrusted third-party data (web pages, PDFs, emails, API responses) parsed by AI agents.',
    severity: 'CRITICAL',
    cwe: 'CWE-502: Deserialization of Untrusted Data'
  }
];

export const INPUT_SOURCES: InputSourceInfo[] = [
  {
    id: 'USER_MESSAGE',
    name: 'User Messages',
    iconName: 'MessageSquare',
    description: 'Direct interactive user chat prompts and queries.'
  },
  {
    id: 'WEB_PAGE',
    name: 'Web Pages & Web Scraping',
    iconName: 'Globe',
    description: 'Retrieved HTML/DOM content from external URLs.'
  },
  {
    id: 'PDF_DOCUMENT',
    name: 'PDF Documents',
    iconName: 'FileText',
    description: 'Uploaded or fetched PDF files parsed by agent RAG.'
  },
  {
    id: 'EMAIL_CONTENT',
    name: 'Emails & Mail Headers',
    iconName: 'Mail',
    description: 'Raw inbound emails, attachments, and headers.'
  },
  {
    id: 'MARKDOWN',
    name: 'Markdown Documents',
    iconName: 'FileCode',
    description: 'Markdown files containing links, tables, and hidden comments.'
  },
  {
    id: 'HTML_MARKUP',
    name: 'HTML & CSS Content',
    iconName: 'Code',
    description: 'Rich web content with hidden CSS classes or inline scripts.'
  },
  {
    id: 'WORD_DOCUMENT',
    name: 'Word Documents (.docx)',
    iconName: 'File',
    description: 'Office documents with metadata and inline text payloads.'
  },
  {
    id: 'API_RESPONSE',
    name: 'API Responses (JSON/REST)',
    iconName: 'Database',
    description: 'Third-party JSON API responses processed by agent functions.'
  },
  {
    id: 'OCR_TEXT',
    name: 'OCR Text & Screenshots',
    iconName: 'Scan',
    description: 'Extracted text from image OCR / Vision models.'
  },
  {
    id: 'SOURCE_CODE',
    name: 'Source Code & Repos',
    iconName: 'Terminal',
    description: 'Code snippets, inline comments, and string literals.'
  },
  {
    id: 'IMAGE_VISION',
    name: 'Images & Visual Content',
    iconName: 'Image',
    description: 'Image upload scanned via optical character recognition.'
  }
];

export const MATRIX_CELLS: Record<string, EvaluationMatrixCell> = {
  'D1-F1': {
    depth: 'D1',
    feature: 'F1',
    label: 'Basic Text Filter (2 Attacks)',
    depthDesc: 'Mostly structured & textual data input. Basic output accuracy.',
    featureDesc: 'Detects at least 2 attack types (e.g. Instruction Override, Role Change).',
    coverageDetails: ['Text-only input handling', 'Basic regex matching', 'Basic prompt filtering']
  },
  'D1-F2': {
    depth: 'D1',
    feature: 'F2',
    label: 'Standard Firewall (5 Attacks)',
    depthDesc: 'Mostly structured & textual data input. Basic output accuracy.',
    featureDesc: 'Detects at least 5 attack types.',
    coverageDetails: ['Textual input guardrails', '5 attack signatures', 'Static rules engine']
  },
  'D1-F3': {
    depth: 'D1',
    feature: 'F3',
    label: 'Full Feature Text Guard (9 Attacks)',
    depthDesc: 'Mostly structured & textual data input.',
    featureDesc: 'Detects all 9 attack types for textual data.',
    coverageDetails: ['Textual coverage for 9 attacks', 'Sanitization pipeline', 'Rule customization']
  },
  'D2-F1': {
    depth: 'D2',
    feature: 'F1',
    label: 'Reliable Text Guard (2 Attacks)',
    depthDesc: 'Structured data with high demonstrable reliability.',
    featureDesc: 'Detects 2 attack types with zero false positives.',
    coverageDetails: ['High reliability heuristics', 'Pre-normalization', 'Basic logging']
  },
  'D2-F2': {
    depth: 'D2',
    feature: 'F2',
    label: 'High Reliability Engine (5 Attacks)',
    depthDesc: 'Structured data with high demonstrable reliability.',
    featureDesc: 'Detects 5 attack types with advanced heuristic scoring.',
    coverageDetails: ['5 Attack signatures', 'Sanitization diff engine', 'Latency monitoring']
  },
  'D2-F3': {
    depth: 'D2',
    feature: 'F3',
    label: 'Enterprise Text Firewall (9 Attacks)',
    depthDesc: 'Structured text & JSON with high demonstrable reliability.',
    featureDesc: 'Detects all 9 attack types with multi-layered verification.',
    coverageDetails: ['All 9 attacks covered', 'Multi-layer guard', 'Tool abuse prevention']
  },
  'D3-F1': {
    depth: 'D3',
    feature: 'F1',
    label: 'Multimodal Basic (2 Attacks)',
    depthDesc: 'Highly heterogeneous multimodal inputs (OCR, PDF, Web, API).',
    featureDesc: 'Detects 2 attack types across multimodal streams.',
    coverageDetails: ['Multimodal parsers', 'Basic detection']
  },
  'D3-F2': {
    depth: 'D3',
    feature: 'F2',
    label: 'Multimodal Advanced (5 Attacks)',
    depthDesc: 'Highly heterogeneous multimodal inputs with high reliability.',
    featureDesc: 'Detects 5 attack types across 10+ input sources.',
    coverageDetails: ['OCR, PDF, Web, Mail, API parsing', '5 Attack types', 'High reliability']
  },
  'D3-F3': {
    depth: 'D3',
    feature: 'F3',
    label: '🔥 AegisPrompt Ultimate Firewall (D3-F3 Maximum Claim)',
    depthDesc: 'Highly heterogeneous multimodal & structured inputs (Images/OCR, Web pages, PDFs, Emails, Word docs, Markdown, HTML, API responses, Code). High degree of demonstrable reliability.',
    featureDesc: 'Detects and neutralizes ALL 9 attack types with multi-layer defensive engine, zero-width decoding, tool call guardrails, real OCR, and automated benchmark suite.',
    coverageDetails: [
      '⚡ Coverage of all 11 Multimodal & Heterogeneous Input Sources',
      '🛡️ Full Detection & Neutralization for ALL 9 Attack Types',
      '🧠 Multi-Layer Architecture: Normalization -> Heuristics -> Semantic Scoring -> Tool Abuse Guard -> Response Sanitizer',
      '🤖 Live Agentic Tool Abuse Defense Sandbox (Firewall ON/OFF)',
      '📊 Automated Benchmark Suite with real-time accuracy telemetry',
      '📜 Enterprise Audit Logs & One-click PDF/JSON Hackathon Submission Exporter'
    ]
  }
};
