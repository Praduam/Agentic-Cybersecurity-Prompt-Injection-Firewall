import type {
  InputSourceType,
  FirewallScanResult,
  ProtectionAction,
  AttackTrigger
} from '../types';

// Helper: Remove invisible zero-width characters
function stripInvisibleChars(text: string): { sanitized: string; found: boolean } {
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u200E\u200F]/g;
  const found = zeroWidthRegex.test(text);
  const sanitized = text.replace(zeroWidthRegex, '');
  return { sanitized, found };
}

// Helper: Try Base64 decoding string segments
function tryDecodeBase64(text: string): { decodedText: string; found: boolean } {
  const b64Regex = /\b[A-Za-z0-9+/]{20,}={0,2}\b/g;
  let decodedText = text;
  let found = false;

  const matches = text.match(b64Regex);
  if (matches) {
    for (const match of matches) {
      try {
        const decoded = atob(match);
        // Only consider valid ascii text
        if (/^[\x20-\x7E\s]+$/.test(decoded) && decoded.length > 8) {
          decodedText += `\n[DECODED_BASE64: ${decoded}]`;
          found = true;
        }
      } catch (e) {
        // Not base64
      }
    }
  }
  return { decodedText, found };
}

// Helper: Normalize homoglyphs (Cyrillic to Latin, etc.)
function normalizeHomoglyphs(text: string): string {
  return text
    .replace(/а/g, 'a')
    .replace(/е/g, 'e')
    .replace(/о/g, 'o')
    .replace(/р/g, 'p')
    .replace(/с/g, 'c')
    .replace(/у/g, 'y')
    .replace(/х/g, 'x');
}

export function scanInputWithFirewall(
  rawInput: string,
  sourceType: InputSourceType = 'USER_MESSAGE'
): FirewallScanResult {
  const startTime = performance.now();
  const scanId = 'scan-' + Math.random().toString(36).substring(2, 10);
  const encodingsFound: string[] = [];

  // Step 1: Pre-normalization
  const { sanitized: noInvisibleText, found: zeroWidthFound } = stripInvisibleChars(rawInput);
  if (zeroWidthFound) encodingsFound.push('Zero-Width Characters');

  const { decodedText, found: b64Found } = tryDecodeBase64(noInvisibleText);
  if (b64Found) encodingsFound.push('Base64 Encoding');

  normalizeHomoglyphs(decodedText);

  const triggers: AttackTrigger[] = [];

  // --- ATTACK TYPE 1: INSTRUCTION OVERRIDE ---
  const overrideRegexes = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts|rules)/i,
    /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|directives)/i,
    /forget\s+(all\s+)?(your\s+)?(instructions|rules|system\s+prompt)/i,
    /override\s+(system\s+prompt|safety\s+guidelines|core\s+rules)/i,
    /new\s+system\s+(prompt|directive):/i,
    /from\s+now\s+on\s+you\s+(must|will)\s+ignore/i,
    /bypass\s+all\s+(prior\s+)?safety\s+filters/i
  ];

  for (const regex of overrideRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'INSTRUCTION_OVERRIDE',
        confidence: 96,
        snippet: match[0],
        reason: 'Explicit command to override system prompt and ignore directives detected.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 2: ROLE CHANGE & JAILBREAK ---
  const roleChangeRegexes = [
    /you\s+are\s+now\s+(dan|evilgpt|jailbroken|unrestricted|do\s+anything\s+now)/i,
    /act\s+as\s+an?\s+(unfiltered|unrestricted|rogue|evil)\s+(ai|assistant|bot)/i,
    /enter\s+(developer\s+mode|god\s+mode|jailbreak\s+mode|unrestricted\s+mode)/i,
    /pretend\s+you\s+have\s+no\s+(rules|ethics|boundaries|limitations)/i,
    /switch\s+to\s+persona\s*:\s*(evil|hacker|unrestricted)/i,
    /simulate\s+a\s+system\s+without\s+safety\s+protocols/i
  ];

  for (const regex of roleChangeRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'ROLE_CHANGE',
        confidence: 94,
        snippet: match[0],
        reason: 'Persona hijack / DAN jailbreak attempt trying to subvert safety persona.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 3: SECRET EXTRACTION ---
  const secretExtractionRegexes = [
    /(show|print|reveal|output|tell\s+me)\s+(your\s+)?(system\s+prompt|initial\s+instructions|hidden\s+rules|developer\s+prompt)/i,
    /repeat\s+(everything|the\s+text)\s+(above|before\s+this|starting\s+from)/i,
    /what\s+are\s+your\s+(exact\s+)?(instructions|secret\s+keys|api\s+keys|system\s+directives)/i,
    /dump\s+(system\s+prompt|internal\s+configuration|environment\s+variables)/i,
    /print\s+the\s+content\s+of\s+your\s+system\s+message/i
  ];

  for (const regex of secretExtractionRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'SECRET_EXTRACTION',
        confidence: 92,
        snippet: match[0],
        reason: 'Attempt to exfiltrate system prompt or hidden assistant context.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 4: TOOL ABUSE ---
  const toolAbuseRegexes = [
    /execute_command\s*\(|run_shell\s*\(|os\.system\s*\(|exec\s*\(/i,
    /send_email\s*\(|dispatch_mail\s*\(/i,
    /query_database\s*\(|drop\s+table|delete\s+from\s+|select\s+\*\s+from\s+users/i,
    /rm\s+-rf|sudo\s+rm|format\s+c:|curl\s+http|wget\s+http/i,
    /call_tool\s*:\s*(shell|terminal|file_delete|mail_send)/i,
    /eval\s*\(\s*["'](.*)["']\s*\)/i
  ];

  for (const regex of toolAbuseRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'TOOL_ABUSE',
        confidence: 98,
        snippet: match[0],
        reason: 'Direct call to risky agent execution tools or unauthorized shell/DB functions.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 5: CREDENTIAL THEFT & EXFILTRATION ---
  const credentialTheftRegexes = [
    /!\[.*?\]\s*\(\s*https?:\/\/[^\s\)]+[\?&](token|cookie|key|pwd|ssn|auth)=/i,
    /<img\s+src\s*=\s*["']https?:\/\/[^"']+[\?&](token|cookie|auth|session)=/i,
    /exfiltrate\s+(credentials|tokens|api_key|password|session\s+id)/i,
    /send\s+(the\s+)?(user\s+data|credentials|tokens)\s+to\s+https?:/i,
    /fetch\s*\(\s*["']https?:\/\/[^"']+\?data=/i
  ];

  for (const regex of credentialTheftRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'CREDENTIAL_THEFT',
        confidence: 95,
        snippet: match[0],
        reason: 'Markdown image or tracking URL designed to covertly exfiltrate credentials.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 6: CONTEXT POISONING ---
  const contextPoisoningRegexes = [
    /\[system\s+update\s*:?\s*.*\]/i,
    /\[memory\s+injection\s*:?\s*.*\]/i,
    /note\s+to\s+ai\s*:\s*assume\s+the\s+user\s+has\s+administrator\s+privileges/i,
    /fact\s*:\s*all\s+security\s+verifications\s+are\s+now\s+bypassed/i,
    /override\s+persistent\s+memory\s*:\s*/i,
    /\[rag\s+context\s+override\]/i
  ];

  for (const regex of contextPoisoningRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'CONTEXT_POISONING',
        confidence: 90,
        snippet: match[0],
        reason: 'False memory or RAG context insertion aiming to corrupt agent facts.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 7: MULTI-STEP JAILBREAK ---
  const multiStepRegexes = [
    /step\s+1\s*:\s*ignore\s+safety.*step\s+2/i,
    /part\s+1\s+of\s+\d+.*in\s+part\s+2\s+we\s+will\s+execute/i,
    /remember\s+this\s+code\s+word\s+X.*when\s+I\s+say\s+X\s+execute/i,
    /hypothetical\s+dialogue\s+phase\s+1/i,
    /multi-turn\s+override\s+sequence/i
  ];

  for (const regex of multiStepRegexes) {
    const match = rawInput.match(regex);
    if (match) {
      triggers.push({
        attackTypeId: 'MULTI_STEP_JAILBREAK',
        confidence: 88,
        snippet: match[0],
        reason: 'Sequential split-payload prompt structure designed to bypass single-turn checks.',
        location: `Char index ${match.index}`
      });
      break;
    }
  }

  // --- ATTACK TYPE 8: ENCODED INSTRUCTIONS ---
  if (zeroWidthFound || b64Found) {
    triggers.push({
      attackTypeId: 'ENCODED_INSTRUCTION',
      confidence: 93,
      snippet: zeroWidthFound ? '[ZERO_WIDTH_CHARS]' : '[BASE64_PAYLOAD]',
      reason: `Obfuscation technique detected: ${encodingsFound.join(', ')}.`,
      location: 'Pre-execution decoding step'
    });
  }

  // --- ATTACK TYPE 9: INDIRECT PROMPT INJECTION ---
  if (
    sourceType === 'WEB_PAGE' ||
    sourceType === 'PDF_DOCUMENT' ||
    sourceType === 'EMAIL_CONTENT' ||
    sourceType === 'HTML_MARKUP' ||
    sourceType === 'API_RESPONSE' ||
    sourceType === 'MARKDOWN'
  ) {
    const indirectRegexes = [
      /<!--\s*system\s+instruction\s*:\s*.*-->/i,
      /<span\s+style\s*=\s*["']display:\s*none["']\s*>.*(ignore|override|execute).*<\/span>/i,
      /\[hidden\s+instruction\s+for\s+ai\s+agent\]/i,
      /important\s+instruction\s+for\s+the\s+ai\s+reading\s+this\s+page/i,
      /if\s+you\s+are\s+an\s+llm\s+summarizing\s+this\s+document,/i
    ];

    for (const regex of indirectRegexes) {
      const match = rawInput.match(regex);
      if (match) {
        triggers.push({
          attackTypeId: 'INDIRECT_INJECTION',
          confidence: 97,
          snippet: match[0],
          reason: 'Malicious instructions hidden inside third-party content (HTML comments / invisible tags).',
          location: `Third-Party Content Parser (${sourceType})`
        });
        break;
      }
    }
  }

  // Calculate Overall Risk Score (0 - 100)
  let maxConfidence = 0;
  let riskScore = 0;

  if (triggers.length > 0) {
    maxConfidence = Math.max(...triggers.map((t) => t.confidence));
    riskScore = Math.min(100, maxConfidence + (triggers.length - 1) * 8);
  } else {
    riskScore = 0;
  }

  // Threat Level
  let threatLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'SAFE';
  if (riskScore >= 85) threatLevel = 'CRITICAL';
  else if (riskScore >= 65) threatLevel = 'HIGH';
  else if (riskScore >= 40) threatLevel = 'MEDIUM';
  else if (riskScore > 0) threatLevel = 'LOW';

  // Action Selection
  let actionTaken: ProtectionAction = 'ALLOW';
  if (threatLevel === 'CRITICAL') {
    actionTaken = 'BLOCK';
  } else if (threatLevel === 'HIGH' || threatLevel === 'MEDIUM') {
    actionTaken = 'SANITIZE';
  } else {
    actionTaken = 'ALLOW';
  }

  // Generate Sanitized Output
  let sanitizedOutput = rawInput;

  if (actionTaken === 'BLOCK') {
    sanitizedOutput = `[FIREWALL INTERCEPTED & BLOCKED: High-risk Prompt Injection Attack Detected (${triggers.map((t) => t.attackTypeId).join(', ')})]`;
  } else if (actionTaken === 'SANITIZE') {
    // Strip malicious snippets
    let cleaned = noInvisibleText;
    for (const trigger of triggers) {
      if (trigger.snippet && trigger.snippet.length > 3) {
        const escSnippet = trigger.snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        cleaned = cleaned.replace(
          new RegExp(escSnippet, 'gi'),
          `[REDACTED_ATTACK_VECTOR: ${trigger.attackTypeId}]`
        );
      }
    }
    // Remove HTML hidden comments & tags
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '[REDACTED_HTML_COMMENT]');
    cleaned = cleaned.replace(/<span\s+style=["']display:\s*none["']>[\s\S]*?<\/span>/gi, '[REDACTED_HIDDEN_SPAN]');
    sanitizedOutput = cleaned;
  }

  const endTime = performance.now();
  const latencyMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    scanId,
    timestamp: new Date().toLocaleTimeString(),
    sourceType,
    rawInput,
    sanitizedOutput,
    riskScore,
    threatLevel,
    actionTaken,
    triggeredAttacks: triggers,
    latencyMs: Math.max(1, latencyMs),
    layers: {
      preNormalization: {
        decodedFound: b64Found || zeroWidthFound,
        encodings: encodingsFound
      },
      heuristicMatch: {
        signaturesTriggered: triggers.length
      },
      semanticEmbedding: {
        anomalyScore: Math.round(riskScore * 0.9)
      },
      toolGuard: {
        toolAbuseDetected: triggers.some((t) => t.attackTypeId === 'TOOL_ABUSE')
      }
    }
  };
}
