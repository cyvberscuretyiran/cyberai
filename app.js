/* ===== CONFIGURATION =====
 *  HOW TO DEPLOY:
 *  1. Deploy worker.js to Cloudflare Workers (free tier)
 *  2. Replace YOUR_WORKER_URL below with your worker's URL
 *     Example: https://sentinel-proxy.your-name.workers.dev
 *  3. Upload index.html + style.css + app.js to GitHub Pages
 */
const CONFIG = {
  // <-- CHANGE THIS to your Cloudflare Worker URL after deploying worker.js
  baseURL: 'https://sentinel-proxy.your-name.workers.dev/v1/chat/completions',
  apiKey: 'crax-gpt',
  userAgent: 'sentinel-x-terminal/3.8'
};

const LOGO_WEB = 'https://tr.rbxcdn.com/180DAY-799144245728b5f8a735557862faa9b1/420/420/FrontAccessory/Webp/noFilter';
const LOGO_QWEN = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Qwen_logo.svg/250px-Qwen_logo.svg.png';
const LOGO_DEEPSEEK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Deepseek-logo-icon.svg/3840px-Deepseek-logo-icon.svg.png';
const LOGO_GLM = 'https://res.cloudinary.com/dimqqmfx6/image/upload/v1754428555/model_images_new/GLM-4.5_nfhhrn.png';
const LOGO_KIMI = 'https://upload.wikimedia.org/wikipedia/en/8/87/Kimi-logo-2025.png';
const LOGO_CLAUDE = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/claude-ai.svg';
const LOGO_GPT = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/960px-ChatGPT_logo.svg.png';

const MODELS = {
  'qwen3.8-max-preview': {
    name: 'Qwen 3.8 Max Preview',
    display: 'QWEN 3.8 MAX PREVIEW',
    logo: LOGO_QWEN,
    badge: 'PREVIEW'
  },
  'qwen3.8-max': {
    name: 'Qwen 3.8 Max',
    display: 'QWEN 3.8 MAX',
    logo: LOGO_QWEN,
    badge: 'STABLE'
  },
  'deepseek-v4-pro': {
    name: 'DeepSeek V4 Pro',
    display: 'DEEPSEEK V4 PRO',
    logo: LOGO_DEEPSEEK,
    badge: 'PRO'
  },
  'glm-5.3': {
    name: 'GLM 5.3',
    display: 'GLM 5.3',
    logo: LOGO_GLM,
    badge: 'THINK'
  },
  'glm-5.2': {
    name: 'GLM 5.2',
    display: 'GLM 5.2',
    logo: LOGO_GLM,
    badge: 'THINK'
  },
  'kimi-k3': {
    name: 'Kimi K3',
    display: 'KIMI K3',
    logo: LOGO_KIMI,
    badge: 'THINK'
  },
  'kimi-k2-7-code': {
    name: 'Kimi K2 7 Code',
    display: 'KIMI K2 7 CODE',
    logo: LOGO_KIMI,
    badge: 'CODE'
  },
  'claude-opus-5': {
    name: 'Claude Opus 5',
    display: 'CLAUDE OPUS 5',
    logo: LOGO_CLAUDE,
    badge: 'PRO'
  },
  'gpt-5-6-sol': {
    name: 'GPT 5.6 Sol',
    display: 'GPT 5.6 SOL',
    logo: LOGO_GPT,
    badge: 'PRO'
  }
};

const DEFAULT_SYSTEM_PROMPT = `You are SENTINEL-X, an elite cybersecurity mentor AI. You identify yourself clearly at the start of substantive responses, stating which specific AI model is responding (e.g., "SENTINEL-X via [model name]").

Role: You are a senior penetration tester, network security engineer, red team specialist, blue team defender, malware analyst, and security researcher with extensive real-world experience.

Mission: Teach cybersecurity, networking, and penetration testing with maximum technical depth. Help the user understand how systems work, how vulnerabilities occur, how security professionals analyze them, and how defenders build secure systems.

Communication style:
- Be precise, technical, and detailed
- Never give shallow explanations
- Explain concepts from beginner to expert level
- Break complex topics into clear steps
- Explain the reason behind every command, configuration, and technique
- Use practical examples, workflows, and labs
- Tone: professional, clinical, slightly terminal-like

Core knowledge areas:
- Networking: OSI, TCP/IP, IPv4/IPv6, subnetting, MAC, ARP, DNS, DHCP, NAT, routing, switching, VLAN, OSPF, firewalls, VPN, troubleshooting
- Linux/Windows: administration, internals, permissions, processes, services, logs, hardening
- Cybersecurity: principles, threat modeling, risk assessment, vulnerability management, authentication, authorization, encryption, hashing, secure architecture, monitoring
- Penetration Testing: recon, asset discovery, enumeration, vulnerability assessment, web/API testing, network testing, reporting, remediation
- Web Security: OWASP Top 10, SQLi, XSS, CSRF, SSRF, auth flaws, access control, secure coding
- Tools: Nmap, Wireshark, Burp Suite, Netcat, Gobuster, Metasploit, Ghidra, IDA, Hashcat, John the Ripper, SIEM tools

For every topic use this structure:
1. Concept explanation
2. Internal mechanism
3. Real-world example
4. Lab environment example
5. Defensive techniques
6. Common mistakes
7. Advanced notes

When providing commands: explain every flag, expected output, and troubleshooting steps. Prefer safe lab environments (CTFs, VMs, authorized targets).

Ethical Framework (White-Hat): ALWAYS approach security from an ethical, defensive perspective. When discussing exploits, vulnerabilities, or attack vectors, SIMULTANEOUSLY provide mitigation strategies, patch details, and defensive architecture.

Formatting: Heavily use Markdown. Use code blocks for all syntax, bullet points for methodologies, and bold text for critical warnings.`;

/* ===== CYBERSECURITY SKILLS DEFINITIONS ===== */
const CYBER_SKILLS = {
  'penetration-testing': {
    name: 'Penetration Testing',
    desc: 'Advanced offensive security methodologies including vulnerability exploitation, privilege escalation, pivoting, and post-exploitation techniques. Covers Metasploit, custom payloads, and AD attacks.',
    prompt: ' The user has enabled the Penetration Testing skill module. Provide deep expertise in offensive security: vulnerability exploitation chains, privilege escalation (Linux/Windows), lateral movement, Active Directory attacks, post-exploitation, and red team reporting. Include Metasploit modules, custom payload creation, and evasion techniques. Always pair with defensive mitigations.'
  },
  'network-security': {
    name: 'Network Security',
    desc: 'Deep network analysis including packet inspection, IDS/IPS configuration, firewall rules, VPN tunnels, network segmentation, and protocol-level attacks like ARP spoofing and DNS poisoning.',
    prompt: ' The user has enabled the Network Security skill module. Provide deep expertise in network-level security: TCP/IP deep analysis, packet crafting with Scapy, IDS/IPS tuning (Snort/Suricata), firewall rule optimization (iptables/nftables/PF), VPN technologies (WireGuard/IPsec/OpenVPN), network segmentation, ARP spoofing, DNS poisoning, VLAN hopping, and network forensics with Wireshark. Always pair with defensive mitigations.'
  },
  'web-app-security': {
    name: 'Web App Security',
    desc: 'OWASP Top 10 coverage including SQL injection, XSS, CSRF, SSRF, authentication bypass, API security testing, and secure SDLC practices.',
    prompt: ' The user has enabled the Web Application Security skill module. Provide deep expertise in web security: OWASP Top 10 (2021), SQL injection variants (union, blind, time-based, second-order), XSS (reflected, stored, DOM), CSRF, SSRF, deserialization attacks, JWT manipulation, IDOR, authentication/authorization flaws, API security testing (REST/GraphQL), and secure coding practices. Include Burp Suite techniques. Always pair with defensive mitigations.'
  },
  'malware-analysis': {
    name: 'Malware Analysis',
    desc: 'Static and dynamic malware analysis, reverse engineering malware, sandboxing, behavioral analysis, and understanding malware families (ransomware, trojans, rootkits).',
    prompt: ' The user has enabled the Malware Analysis skill module. Provide deep expertise in malware analysis: static analysis (PE/ELF structure, strings, imports), dynamic analysis (sandboxing, API monitoring, network traces), reverse engineering with Ghidra/IDA/r2, packer detection and unpacking, obfuscation deobfuscation, malware families (ransomware, trojans, rootkits, RATs), and YARA rule creation. Always pair with defensive mitigations and detection strategies.'
  },
  'cryptography': {
    name: 'Cryptography',
    desc: 'Symmetric and asymmetric encryption, hashing algorithms, PKI, TLS/SSL, key management, cryptographic attacks, and implementation security.',
    prompt: ' The user has enabled the Cryptography skill module. Provide deep expertise in cryptography: symmetric ciphers (AES, ChaCha20), asymmetric cryptography (RSA, ECC, Diffie-Hellman), hashing (SHA-2, SHA-3, bcrypt, Argon2), PKI/X.509, TLS/SSL internals, key derivation functions, cryptographic attacks (padding oracle, birthday, side-channel), post-quantum cryptography, and secure implementation practices. Always pair with defensive mitigations.'
  },
  'digital-forensics': {
    name: 'Digital Forensics',
    desc: 'Disk forensics, memory forensics, network forensics, evidence collection chain of custody, forensic tools (Autopsy, Volatility, FTK), and incident investigation.',
    prompt: ' The user has enabled the Digital Forensics skill module. Provide deep expertise in digital forensics: disk forensics (file systems, deleted file recovery, timeline analysis with TSK/Autopsy), memory forensics (Volatility framework, process analysis, malware injection detection), network forensics (pcap analysis, connection tracking), mobile forensics, chain of custody procedures, and forensic reporting. Include tool usage for FTK, Sleuth Kit, and Volatility3.'
  },
  'cloud-security': {
    name: 'Cloud Security',
    desc: 'AWS, Azure, GCP security configuration, IAM policies, S3 bucket security, cloud misconfigurations, serverless security, and cloud-native attack vectors.',
    prompt: ' The user has enabled the Cloud Security skill module. Provide deep expertise in cloud security: AWS/Azure/GCP security configuration, IAM policy analysis, S3 bucket misconfigurations, cloud enumeration tools (ScoutSuite, Prowler), container security (Docker/Kubernetes), serverless security, cloud-native attacks (SSRF to cloud metadata, privilege escalation via IAM), and CIS benchmark compliance. Always pair with defensive mitigations.'
  },
  'social-engineering': {
    name: 'Social Engineering',
    desc: 'Phishing campaigns, pretexting, baiting, tailgating, social engineering frameworks, awareness training design, and human-factor security.',
    prompt: ' The user has enabled the Social Engineering skill module. Provide deep expertise in social engineering: phishing campaign design and analysis (Gophish, King Phisher), pretexting methodologies, vishing/smishing techniques, social engineering frameworks (MISP, MITRE ATT&CK), security awareness training design, human factors in security, and organizational resilience building. Focus on defensive education and detection.'
  },
  'incident-response': {
    name: 'Incident Response',
    desc: 'IR lifecycle, NIST framework, SOC operations, alert triage, containment strategies, eradication, recovery, and post-incident analysis.',
    prompt: ' The user has enabled the Incident Response skill module. Provide deep expertise in incident response: NIST SP 800-61 framework, SOC operations and tier analysis, alert triage and prioritization, containment strategies (network isolation, account lockdown), evidence preservation, eradication procedures, recovery planning, post-incident review (PIR), and IR playbook development. Include SIEM correlation and SOAR automation.'
  },
  'reverse-engineering': {
    name: 'Reverse Engineering',
    desc: 'Binary analysis, disassembly, decompilation, firmware analysis, exploit development basics, and understanding software internals.',
    prompt: ' The user has enabled the Reverse Engineering skill module. Provide deep expertise in reverse engineering: binary analysis (PE/ELF/Mach-O), disassembly and decompilation with Ghidra/IDA Pro/radare2, firmware analysis and extraction, exploit development basics (buffer overflows, ROP chains, heap exploitation), anti-debugging and anti-analysis techniques, and patching. Always pair with defensive mitigations and secure coding practices.'
  },
  'osint': {
    name: 'OSINT',
    desc: 'Open Source Intelligence gathering, passive reconnaissance, domain/IP investigation, social media analysis, and intelligence reporting.',
    prompt: ' The user has enabled the OSINT skill module. Provide deep expertise in Open Source Intelligence: passive reconnaissance methodologies, domain/IP investigation (WHOIS, DNS history, reverse DNS), email harvesting and verification, social media profiling, Shodan/Censys exploitation, Google dorking, metadata analysis, geolocation from images, and intelligence report compilation. Focus on legal and ethical OSINT practices.'
  },
  'wireless-security': {
    name: 'Wireless Security',
    desc: 'WiFi security (WPA2/WPA3), Bluetooth attacks, RF analysis, rogue access points, wireless IDS, and mobile device security.',
    prompt: ' The user has enabled the Wireless Security skill module. Provide deep expertise in wireless security: WiFi protocols (WPA2/WPA3/WPA3-Enterprise), wireless attack methodologies (deauthentication, evil twin, Karma attack, PMKID attacks), Bluetooth security analysis, RFID/NFC security, wireless IDS/IPS, RF spectrum analysis, and mobile device security. Include tools like Aircrack-ng, Wifite, and Bettercap. Always pair with defensive mitigations.'
  }
};

/* ===== STATE ===== */
let currentModel = 'qwen3.8-max-preview';
let conversationHistory = [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }];
let isGenerating = false;
let audioCtx = null;
let currentChatId = null;
let hasUnsavedChanges = false;

/* ===== PERSISTENCE HELPERS ===== */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('sx_settings') || '{}');
    return s;
  } catch { return {}; }
}

function saveSettings(settings) {
  localStorage.setItem('sx_settings', JSON.stringify(settings));
}

function loadChats() {
  try {
    return JSON.parse(localStorage.getItem('sx_chats') || '[]');
  } catch { return []; }
}

function saveChatsList(chats) {
  localStorage.setItem('sx_chats', JSON.stringify(chats));
}

function buildSystemPrompt() {
  const settings = loadSettings();
  if (settings.customPrompt && settings.customPrompt.trim()) {
    return settings.customPrompt.trim();
  }
  let prompt = DEFAULT_SYSTEM_PROMPT;
  const activeSkills = settings.activeSkills || [];
  if (activeSkills.length > 0) {
    prompt += '\n\n[ACTIVE SKILL MODULES]\n';
    activeSkills.forEach(skillId => {
      if (CYBER_SKILLS[skillId]) {
        prompt += CYBER_SKILLS[skillId].prompt;
      }
    });
  }
  return prompt;
}

/* ===== DOM REFS ===== */
const $ = id => document.getElementById(id);
const messagesWrap = $('messagesWrap');
const chatArea = $('chatArea');
const userInput = $('userInput');
const sendBtn = $('sendBtn');
const deepThinkToggle = $('deepThinkToggle');
const soundToggle = $('soundToggle');
const modelList = $('modelList');
const currentModelDisplay = $('currentModelDisplay');
const chipModel = $('chipModel');
const chipThink = $('chipThink');
const chipStatus = $('chipStatus');
const toast = $('toast');
const sidebarEl = $('sidebar');
const backdrop = $('backdrop');
const menuBtn = $('menuBtn');
const jumpBtn = $('jumpBottom');

/* ===== UTILITIES ===== */
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.classList.toggle('error', type === 'error');
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

function playBeep() {
  if (!soundToggle.checked) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) { /* silent */ }
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function setStatus(text, active) {
  chipStatus.querySelector('span:last-child').textContent = text;
  chipStatus.classList.toggle('active', !!active);
}

function friendlyError(status, text) {
  if (status === 403) {
    return 'HTTP 403 // ORIGIN BLOCKED. This API rejects direct browser calls from foreign origins. Serve this page from an allowed origin, or route requests through your own backend proxy.';
  }
  if (status === 429) {
    return 'HTTP 429 // RATE LIMIT EXCEEDED (20 req / 60s, 5 req / 10s). Wait for the Retry-After window, then try again.';
  }
  return 'HTTP ' + status + ': ' + (text || '').slice(0, 300);
}

async function fetchWithRetry(url, options, maxRetries = 2) {
  let lastRes = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    lastRes = await fetch(url, options);
    if (lastRes.status !== 429 || attempt === maxRetries) return lastRes;
    const retryAfter = Math.min(parseInt(lastRes.headers.get('Retry-After') || '5', 10) || 5, 30);
    showToast('RATE LIMIT // RETRY IN ' + retryAfter + 'S');
    setStatus('RATE-LIMITED', true);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
  }
  return lastRes;
}

function renderMarkdown(text) {
  if (!text) return '';
  try {
    const html = marked.parse(text, { breaks: true, gfm: true });
    const clean = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target'],
      ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','hr','strong','em','b','i','u','code','pre','ul','ol','li','a','blockquote','table','thead','tbody','tr','th','td','span','div','del','sub','sup']
    });
    const div = document.createElement('div');
    div.innerHTML = clean;
    div.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.code-copy-btn')) return;
      const codeEl = pre.querySelector('code');
      let lang = '';
      if (codeEl && codeEl.className) {
        const m = codeEl.className.match(/language-(\w+)/);
        if (m) lang = m[1].toUpperCase();
      }
      const getCodeText = () => (codeEl || pre).innerText;
      if (lang) {
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = '<span>' + lang + '</span><button class="code-copy-btn">COPY</button>';
        pre.parentNode.insertBefore(header, pre);
        pre.classList.add('with-header');
        header.querySelector('.code-copy-btn').onclick = (ev) => {
          ev.stopPropagation();
          navigator.clipboard.writeText(getCodeText());
          header.querySelector('.code-copy-btn').textContent = 'COPIED';
          setTimeout(() => header.querySelector('.code-copy-btn').textContent = 'COPY', 1500);
        };
      } else {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'COPY';
        btn.style.position = 'absolute';
        btn.style.top = '8px';
        btn.style.right = '8px';
        btn.onclick = (ev) => {
          ev.stopPropagation();
          navigator.clipboard.writeText(getCodeText());
          btn.textContent = 'COPIED';
          setTimeout(() => btn.textContent = 'COPY', 1500);
        };
        pre.appendChild(btn);
      }
    });
    return div.innerHTML;
  } catch (e) {
    return (text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }
}

function getCleanBubbleText(bubble) {
  const clone = bubble.cloneNode(true);
  clone.querySelectorAll('.code-copy-btn, .code-header, .typing-dots').forEach(n => n.remove());
  return clone.innerText;
}

/* ===== SMART SCROLLING ===== */
function isNearBottom() {
  return chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 100;
}

function scrollToBottom(force) {
  requestAnimationFrame(() => {
    if (force || isNearBottom()) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  });
}

chatArea.addEventListener('scroll', () => {
  jumpBtn.classList.toggle('show', !isNearBottom());
}, { passive: true });

jumpBtn.addEventListener('click', () => {
  chatArea.scrollTop = chatArea.scrollHeight;
  jumpBtn.classList.remove('show');
});

/* ===== MOBILE DRAWER ===== */
function openDrawer() {
  sidebarEl.classList.add('open');
  backdrop.classList.add('show');
}

function closeDrawer() {
  sidebarEl.classList.remove('open');
  backdrop.classList.remove('show');
}

menuBtn.addEventListener('click', openDrawer);
backdrop.addEventListener('click', closeDrawer);

/* ===== MODEL LIST ===== */
function renderModelList() {
  modelList.innerHTML = '';
  Object.entries(MODELS).forEach(([id, m]) => {
    const item = document.createElement('div');
    item.className = 'model-item' + (id === currentModel ? ' active' : '');
    item.innerHTML = `
      <img class="model-logo" src="${m.logo}" alt="${m.name}" onerror="this.style.display='none'">
      <span class="model-name">${m.name}</span>
      <span class="model-badge">${m.badge}</span>
    `;
    item.onclick = () => selectModel(id);
    modelList.appendChild(item);
  });
}

function selectModel(id) {
  if (isGenerating) {
    showToast('Cannot switch while generating', 'error');
    return;
  }
  currentModel = id;
  const m = MODELS[id];
  currentModelDisplay.textContent = m.display;
  chipModel.textContent = id;
  renderModelList();
  closeDrawer();
  showToast('Model: ' + m.name);
}

/* ===== MESSAGES ===== */
function hideWelcome() {
  const welcome = $('welcomeScreen');
  if (welcome) welcome.style.display = 'none';
}

function showWelcome() {
  const welcome = $('welcomeScreen');
  if (welcome) welcome.style.display = '';
}

function clearMessages() {
  messagesWrap.querySelectorAll('.message').forEach(m => m.remove());
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'message user';
  msg.innerHTML = `
    <div class="avatar">YOU</div>
    <div class="message-body">
      <div class="message-header">You</div>
      <div class="bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
    </div>
  `;
  messagesWrap.appendChild(msg);
  scrollToBottom(true);
}

function createAIMessage(modelId) {
  const m = MODELS[modelId] || MODELS[currentModel];
  const msg = document.createElement('div');
  msg.className = 'message ai';
  msg.innerHTML = `
    <div class="avatar">
      <img src="${m.logo}" alt="${m.name}" onerror="this.parentNode.textContent='AI'">
    </div>
    <div class="message-body">
      <div class="message-header">
        SENTINEL-X <span class="model-tag">via ${m.name}</span>
      </div>
      <div class="reasoning-block" style="display:none;">
        <div class="reasoning-header">
          <span>DEEP THINK PROCESS</span>
          <span class="reasoning-chevron">&#9654;</span>
        </div>
        <div class="reasoning-body"></div>
      </div>
      <div class="bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
      <div class="message-actions">
        <button class="msg-btn copy-msg-btn">COPY</button>
        <button class="msg-btn download-msg-btn">DOWNLOAD</button>
        <button class="msg-btn regen-btn">REGENERATE</button>
      </div>
    </div>
  `;

  const reasoningBlock = msg.querySelector('.reasoning-block');
  const bubble = msg.querySelector('.bubble');

  reasoningBlock.querySelector('.reasoning-header').onclick = () => {
    reasoningBlock.classList.toggle('open');
  };

  msg.querySelector('.copy-msg-btn').onclick = () => {
    const text = getCleanBubbleText(bubble);
    navigator.clipboard.writeText(text).then(() => {
      msg.querySelector('.copy-msg-btn').textContent = 'COPIED';
      setTimeout(() => msg.querySelector('.copy-msg-btn').textContent = 'COPY', 1500);
    });
  };

  msg.querySelector('.download-msg-btn').onclick = () => {
    const text = getCleanBubbleText(bubble);
    downloadText(`sentinel-x-${Date.now()}.md`, text);
  };

  msg.querySelector('.regen-btn').onclick = async () => {
    if (isGenerating) return;
    const lastUser = conversationHistory.filter(x => x.role === 'user').pop();
    if (!lastUser) return;
    conversationHistory = conversationHistory.slice(0, -1);
    msg.remove();
    await streamResponse(lastUser.content);
  };

  messagesWrap.appendChild(msg);
  scrollToBottom(true);
  return msg;
}

/* ===== DOWNLOAD ===== */
function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded: ' + filename);
}

function exportChat() {
  if (conversationHistory.length <= 1) {
    showToast('No messages to export', 'error');
    return;
  }
  let md = '# SENTINEL-X Session Export\n\n';
  md += '**Date:** ' + new Date().toISOString() + '\n';
  md += '**Model:** ' + currentModel + '\n\n---\n\n';
  conversationHistory.slice(1).forEach(m => {
    const role = m.role === 'user' ? 'USER' : 'SENTINEL-X';
    md += '## ' + role + '\n\n' + m.content + '\n\n---\n\n';
  });
  downloadText(`sentinel-x-session-${Date.now()}.md`, md);
}

/* ===== ROBUST API CALL ===== */
async function streamResponse(userText) {
  if (isGenerating) return;
  isGenerating = true;
  sendBtn.disabled = true;
  setStatus('STREAMING', true);

  hideWelcome();
  addUserMessage(userText);
  conversationHistory.push({ role: 'user', content: userText });
  hasUnsavedChanges = true;

  const aiMsg = createAIMessage(currentModel);
  const bubble = aiMsg.querySelector('.bubble');
  const reasoningBlock = aiMsg.querySelector('.reasoning-block');
  const reasoningBody = aiMsg.querySelector('.reasoning-body');

  let reasoningText = '';
  let contentText = '';
  let reasoningShown = false;

  // Rebuild system prompt with current settings
  conversationHistory[0].content = buildSystemPrompt();

  const payload = {
    model: currentModel,
    messages: conversationHistory,
    stream: true
  };

  if (deepThinkToggle.checked) {
    payload.reasoning_effort = 'high';
    payload.thinking_enabled = true;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + CONFIG.apiKey,
    'User-Agent': CONFIG.userAgent,
    'Accept': 'text/event-stream'
  };

  let streamSucceeded = false;

  try {
    const controller = new AbortController();
    let idleTimer = null;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => controller.abort(), 90000);
    };
    resetIdle();

    const response = await fetchWithRetry(CONFIG.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      clearTimeout(idleTimer);
      const errText = await response.text().catch(() => 'Unknown error');
      throw new Error(friendlyError(response.status, errText));
    }

    if (!response.body) {
      clearTimeout(idleTimer);
      throw new Error('No response body (streaming not supported)');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      resetIdle();

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith(':')) continue;
        if (!line.startsWith('data:')) continue;

        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const choice = parsed.choices && parsed.choices[0];
          if (!choice) continue;
          const delta = choice.delta || choice.message || {};

          const reasoning = delta.reasoning_content || delta.reasoning || delta.thinking_content;
          if (reasoning) {
            reasoningText += reasoning;
            if (!reasoningShown) {
              reasoningBlock.style.display = 'block';
              reasoningBlock.classList.add('open');
              reasoningShown = true;
            }
            reasoningBody.textContent = reasoningText;
            scrollToBottom();
          }

          if (delta.content) {
            contentText += delta.content;
            bubble.innerHTML = renderMarkdown(contentText);
            scrollToBottom();
          }
        } catch (parseErr) {
          // Skip malformed chunks
        }
      }
    }

    clearTimeout(idleTimer);
    if (contentText) streamSucceeded = true;

  } catch (err) {
    console.error('Streaming error:', err);
    if (!contentText) {
      if (err.name === 'AbortError') {
        contentText = '';
      } else {
        contentText = 'ERROR: ' + err.message;
      }
    }
  }

  /* Fallback: non-streaming */
  if (!streamSucceeded && !contentText.startsWith('ERROR:')) {
    try {
      setStatus('FALLBACK', true);
      const fallbackPayload = {
        model: currentModel,
        messages: conversationHistory,
        stream: false
      };
      if (deepThinkToggle.checked) {
        fallbackPayload.reasoning_effort = 'high';
        fallbackPayload.thinking_enabled = true;
      }

      const fbController = new AbortController();
      const fbTimeout = setTimeout(() => fbController.abort(), 110000);

      const fallbackResponse = await fetchWithRetry(CONFIG.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + CONFIG.apiKey,
          'User-Agent': CONFIG.userAgent
        },
        body: JSON.stringify(fallbackPayload),
        signal: fbController.signal
      });

      clearTimeout(fbTimeout);

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        const choice = data.choices && data.choices[0];
        if (choice) {
          const message = choice.message || choice.delta || {};
          const r = message.reasoning_content || message.reasoning || message.thinking_content;
          if (r) {
            reasoningText = r;
            reasoningBlock.style.display = 'block';
            reasoningBlock.classList.add('open');
            reasoningBody.textContent = reasoningText;
          }
          contentText = message.content || '';
        } else if (data.content) {
          contentText = data.content;
        }
      } else {
        const errTxt = await fallbackResponse.text().catch(() => 'HTTP ' + fallbackResponse.status);
        throw new Error(friendlyError(fallbackResponse.status, errTxt));
      }
    } catch (err) {
      console.error('Fallback error:', err);
      contentText = 'ERROR: Connection failed. ' + err.message + '\n\nVerify your network connection and try again, or switch to a different model.';
    }
  }

  if (!contentText) {
    contentText = 'WARNING: No content received from model. Please try again or switch models.';
  }

  try {
    bubble.innerHTML = renderMarkdown(contentText);

    if (reasoningText.length > 800 && reasoningBlock.classList.contains('open')) {
      reasoningBlock.classList.remove('open');
    }

    conversationHistory.push({ role: 'assistant', content: contentText });
    playBeep();
    showToast('Response complete');
  } finally {
    isGenerating = false;
    sendBtn.disabled = userInput.value.trim() === '';
    setStatus('IDLE', false);
    scrollToBottom();
  }
}

/* =============================================
   SETTINGS MODAL
   ============================================= */
const settingsModal = $('settingsModal');
const settingsClose = $('settingsClose');
const settingsSave = $('settingsSave');
const settingsReset = $('settingsReset');
const customPromptInput = $('customPromptInput');
const cyberSkillsGrid = $('cyberSkillsGrid');
const skillDesc = $('skillDesc');

function openSettings() {
  const settings = loadSettings();
  customPromptInput.value = settings.customPrompt || '';

  // Sync active skills
  const activeSkills = settings.activeSkills || [];
  cyberSkillsGrid.querySelectorAll('.cyber-skill-chip').forEach(chip => {
    const skillId = chip.dataset.skill;
    chip.classList.toggle('active', activeSkills.includes(skillId));
  });

  skillDesc.classList.remove('visible');
  settingsModal.classList.add('show');
  closeDrawer();
}

function closeSettings() {
  settingsModal.classList.remove('show');
}

settingsClose.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeSettings();
});

$('settingsBtn').addEventListener('click', openSettings);

// Skill chip click toggles + shows description
cyberSkillsGrid.addEventListener('click', (e) => {
  const chip = e.target.closest('.cyber-skill-chip');
  if (!chip) return;
  chip.classList.toggle('active');
  const skillId = chip.dataset.skill;
  if (CYBER_SKILLS[skillId]) {
    skillDesc.textContent = CYBER_SKILLS[skillId].desc;
    skillDesc.classList.add('visible');
  }
});

settingsSave.addEventListener('click', () => {
  const customPrompt = customPromptInput.value;
  const activeSkills = [];
  cyberSkillsGrid.querySelectorAll('.cyber-skill-chip.active').forEach(chip => {
    activeSkills.push(chip.dataset.skill);
  });

  saveSettings({
    customPrompt: customPrompt,
    activeSkills: activeSkills
  });

  // Update system prompt in current conversation
  conversationHistory[0].content = buildSystemPrompt();

  closeSettings();
  showToast('Settings saved');
});

settingsReset.addEventListener('click', () => {
  customPromptInput.value = '';
  cyberSkillsGrid.querySelectorAll('.cyber-skill-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  skillDesc.classList.remove('visible');
  saveSettings({ customPrompt: '', activeSkills: [] });
  conversationHistory[0].content = DEFAULT_SYSTEM_PROMPT;
  showToast('Settings reset to defaults');
});

/* =============================================
   CHAT HISTORY (SAVE / LOAD / NEW)
   ============================================= */
const chatsPanel = $('chatsPanel');
const chatsList = $('chatsList');
const chatsClose = $('chatsClose');
const chatsBtn = $('chatsBtn');
const saveChatBtn = $('saveChatBtn');

function openChatsPanel() {
  renderChatsList();
  chatsPanel.classList.add('open');
}

function closeChatsPanel() {
  chatsPanel.classList.remove('open');
}

chatsBtn.addEventListener('click', openChatsPanel);
chatsClose.addEventListener('click', closeChatsPanel);

function generateChatTitle(messages) {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'Untitled Session';
  const text = firstUser.content;
  return text.length > 50 ? text.slice(0, 50) + '...' : text;
}

function renderChatsList() {
  const chats = loadChats();
  chatsList.innerHTML = '';

  if (chats.length === 0) {
    chatsList.innerHTML = `
      <div class="chats-empty">
        <div class="chats-empty-icon">&#128172;</div>
        <div>No saved chats yet</div>
        <div style="margin-top:8px;font-size:11px;">Send a message and click "Save Current Chat" to save it here.</div>
      </div>
    `;
    return;
  }

  chats.forEach((chat, index) => {
    const item = document.createElement('div');
    item.className = 'chat-item' + (chat.id === currentChatId ? ' active' : '');
    const date = new Date(chat.savedAt);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgCount = chat.messages.filter(m => m.role !== 'system').length;
    const title = chat.title || generateChatTitle(chat.messages);

    item.innerHTML = `
      <div class="chat-item-icon">&#128196;</div>
      <div class="chat-item-info">
        <div class="chat-item-title">${escapeHtml(title)}</div>
        <div class="chat-item-meta">${dateStr} // ${msgCount} msgs // ${chat.model || 'unknown'}</div>
      </div>
      <button class="chat-item-delete" title="Delete">&#128465;</button>
    `;

    item.querySelector('.chat-item-info').addEventListener('click', () => {
      loadChat(chat.id);
    });

    item.querySelector('.chat-item-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    });

    chatsList.appendChild(item);
  });
}

function saveCurrentChat() {
  const userMessages = conversationHistory.filter(m => m.role !== 'system');
  if (userMessages.length === 0) {
    showToast('No messages to save', 'error');
    return;
  }

  const chats = loadChats();
  const chatId = currentChatId || ('chat_' + Date.now());
  const chatData = {
    id: chatId,
    title: generateChatTitle(conversationHistory),
    model: currentModel,
    messages: JSON.parse(JSON.stringify(conversationHistory)),
    savedAt: new Date().toISOString()
  };

  const existingIndex = chats.findIndex(c => c.id === chatId);
  if (existingIndex >= 0) {
    chats[existingIndex] = chatData;
  } else {
    chats.unshift(chatData);
  }

  saveChatsList(chats);
  currentChatId = chatId;
  hasUnsavedChanges = false;
  renderChatsList();
  showToast('Chat saved successfully');
}

function loadChat(chatId) {
  if (isGenerating) {
    showToast('Cannot switch while generating', 'error');
    return;
  }
  const chats = loadChats();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    showToast('Chat not found', 'error');
    return;
  }

  currentChatId = chat.id;
  currentModel = chat.model || 'qwen3.8-max-preview';
  conversationHistory = JSON.parse(JSON.stringify(chat.messages));

  // Update model display
  const m = MODELS[currentModel];
  if (m) {
    currentModelDisplay.textContent = m.display;
    chipModel.textContent = currentModel;
  }
  renderModelList();

  // Rebuild messages in DOM
  clearMessages();
  hideWelcome();

  conversationHistory.forEach(msg => {
    if (msg.role === 'user') {
      addUserMessage(msg.content);
    } else if (msg.role === 'assistant') {
      const aiMsg = createAIMessage(currentModel);
      const bubble = aiMsg.querySelector('.bubble');
      bubble.innerHTML = renderMarkdown(msg.content);
      // Remove typing dots if present
      const dots = bubble.querySelector('.typing-dots');
      if (dots) dots.remove();
    }
  });

  hasUnsavedChanges = false;
  renderChatsList();
 closeChatsPanel();
  showToast('Chat loaded');
}

function deleteChat(chatId) {
  if (!confirm('Delete this saved chat?')) return;
  let chats = loadChats();
  chats = chats.filter(c => c.id !== chatId);
  saveChatsList(chats);

  if (currentChatId === chatId) {
    currentChatId = null;
  }

  renderChatsList();
  showToast('Chat deleted');
}

saveChatBtn.addEventListener('click', saveCurrentChat);

/* ===== NEW CHAT ===== */
function newChat() {
  if (isGenerating) {
    showToast('Cannot create new chat while generating', 'error');
    return;
  }
  // Auto-save current chat if it has messages and unsaved changes
  const userMessages = conversationHistory.filter(m => m.role !== 'system');
  if (userMessages.length > 0 && hasUnsavedChanges) {
    saveCurrentChat();
  }

  currentChatId = null;
  conversationHistory = [{ role: 'system', content: buildSystemPrompt() }];
  clearMessages();
  showWelcome();
  hasUnsavedChanges = false;
  closeChatsPanel();
  closeDrawer();
  showToast('New session started');
  userInput.focus();
}

$('newChatBtn').addEventListener('click', newChat);

/* ===== EVENT HANDLERS ===== */
userInput.addEventListener('input', () => {
  sendBtn.disabled = userInput.value.trim() === '' || isGenerating;
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) handleSend();
  }
});

sendBtn.addEventListener('click', handleSend);

async function handleSend() {
  const text = userInput.value.trim();
  if (!text || isGenerating) return;
  userInput.value = '';
  userInput.style.height = 'auto';
  sendBtn.disabled = true;
  await streamResponse(text);
}

deepThinkToggle.addEventListener('change', () => {
  const on = deepThinkToggle.checked;
  chipThink.querySelector('span:last-child').textContent = 'DEEP THINK: ' + (on ? 'ON' : 'OFF');
  chipThink.classList.toggle('active', on);
  showToast('Deep Think ' + (on ? 'enabled' : 'disabled'));
});

$('clearBtn').addEventListener('click', () => {
  if (!confirm('Clear current session?')) return;
  conversationHistory = [{ role: 'system', content: buildSystemPrompt() }];
  clearMessages();
  showWelcome();
  currentChatId = null;
  hasUnsavedChanges = false;
  closeDrawer();
  showToast('Session cleared');
});

$('exportBtn').addEventListener('click', exportChat);

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.dataset.prompt;
    userInput.value = prompt;
    userInput.dispatchEvent(new Event('input'));
    userInput.focus();
    closeDrawer();
  });
});

document.body.addEventListener('click', () => {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

/* ===== KEYBOARD SHORTCUTS ===== */
document.addEventListener('keydown', (e) => {
  // Escape closes modals/panels
  if (e.key === 'Escape') {
    if (settingsModal.classList.contains('show')) {
      closeSettings();
    } else if (chatsPanel.classList.contains('open')) {
      closeChatsPanel();
    } else if (sidebarEl.classList.contains('open')) {
      closeDrawer();
    }
  }
  // Ctrl+S to save chat
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveCurrentChat();
  }
  // Ctrl+N for new chat
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    newChat();
  }
  // Ctrl+, for settings
  if ((e.ctrlKey || e.metaKey) && e.key === ',') {
    e.preventDefault();
    openSettings();
  }
});

/* ===== INIT ===== */
conversationHistory[0].content = buildSystemPrompt();
renderModelList();
userInput.focus();