export const moduleFlow = [
  {
    title: "Citizen",
    detail: "Anonymous reporting from public, police, or bank channels.",
    accent: "Emerald intake",
  },
  {
    title: "Anonymous Complaint",
    detail:
      "Text, voice note, screenshot, video, URL, UPI, phone, and location.",
    accent: "Evidence capture",
  },
  {
    title: "AI Classifier",
    detail: "Scam type, risk, entities, confidence, and recommended action.",
    accent: "Structured intelligence",
  },
  {
    title: "OSINT + Agentic AI",
    detail:
      "WHOIS, DNS, social signals, news, graph expansion, and evidence gathering.",
    accent: "Investigation layer",
  },
  {
    title: "Knowledge Graph",
    detail:
      "Phone, UPI, wallet, domain, Telegram, location, and complaint relationships.",
    accent: "Entity resolution",
  },
  {
    title: "Geo + Risk Engine",
    detail:
      "Hotspots, clusters, district risk, trend detection, and threat scoring.",
    accent: "Operational response",
  },
] as const;

export const dashboardMetrics = [
  {
    label: "Today's complaints",
    value: "128",
    delta: "+18%",
    tone: "emerald",
  },
  {
    label: "High-risk accounts",
    value: "34",
    delta: "+7",
    tone: "rose",
  },
  {
    label: "Active investigations",
    value: "19",
    delta: "+4",
    tone: "amber",
  },
  {
    label: "Deepfake cases",
    value: "11",
    delta: "+2",
    tone: "orange",
  },
  {
    label: "New UPI IDs",
    value: "63",
    delta: "+24%",
    tone: "emerald",
  },
  {
    label: "Avg threat score",
    value: "82.4",
    delta: "+5.1",
    tone: "rose",
  },
] as const;

export const districtRanking = [
  {
    district: "Mumbai",
    score: 94,
    cases: 42,
    signal: "UPI refund clusters",
  },
  {
    district: "Bengaluru",
    score: 88,
    cases: 31,
    signal: "Telegram impersonation",
  },
  {
    district: "Delhi NCR",
    score: 81,
    cases: 28,
    signal: "Loan app extortion",
  },
  {
    district: "Hyderabad",
    score: 77,
    cases: 22,
    signal: "Deepfake job scams",
  },
  {
    district: "Pune",
    score: 73,
    cases: 19,
    signal: "Wallet fraud links",
  },
] as const;

export const geoHotspots = [
  {
    district: "Andheri East",
    intensity: 96,
    complaints: 18,
    tone: "rose",
  },
  {
    district: "Whitefield",
    intensity: 82,
    complaints: 13,
    tone: "amber",
  },
  {
    district: "Gurugram Cyber Hub",
    intensity: 74,
    complaints: 11,
    tone: "orange",
  },
] as const;

export const knowledgeGraphNodes = [
  { label: "Phone", value: "+91 98765 43210" },
  { label: "UPI", value: "fraud@ybl" },
  { label: "Website", value: "verify-payments.in" },
  { label: "Telegram", value: "@refund_support" },
  { label: "Wallet", value: "wallet-9082" },
  { label: "Complaint", value: "CMP-10482" },
] as const;

export const investigationSamples = [
  {
    entity: "fraud@ybl",
    entityType: "upi",
    score: 91,
    status: "Likely mule network",
    aliases: ["refund@ybl", "helpdesk@ybl"],
    complaints: ["CMP-10482", "CMP-10491", "CMP-10503"],
    osint: [
      "WHOIS: domain aged 14 days",
      "Telegram mention in scam channel",
      "AbuseIPDB flag present",
    ],
    suggestedActions: [
      "Freeze linked UPI handles",
      "Preserve logs",
      "Escalate to bank fraud cell",
    ],
    missing: ["Device fingerprint", "Beneficiary bank account", "KYC trail"],
  },
  {
    entity: "+919876543210",
    entityType: "phone",
    score: 86,
    status: "Coordinated impersonation",
    aliases: ["support line", "bank helpdesk"],
    complaints: ["CMP-10392", "CMP-10407"],
    osint: [
      "Caller ID spoofing traces",
      "Search mentions across forums",
      "Shared with 2 Telegram accounts",
    ],
    suggestedActions: [
      "Trace carrier metadata",
      "Link to complaint graph",
      "Notify regional cyber cell",
    ],
    missing: ["IMSI / IMEI", "Call recordings", "Contact chain"],
  },
  {
    entity: "verify-payments.in",
    entityType: "domain",
    score: 95,
    status: "Phishing infrastructure",
    aliases: ["secure-verify.in", "refund-checker.com"],
    complaints: ["CMP-10455", "CMP-10463", "CMP-10478", "CMP-10480"],
    osint: [
      "Domain registered 9 days ago",
      "SSL issued via free CA",
      "Screenshot matches known phishing template",
    ],
    suggestedActions: [
      "Submit takedown request",
      "Block domain in monitoring stack",
      "Alert impacted users",
    ],
    missing: ["Hosting provider", "Registrar abuse contact", "Redirect chain"],
  },
] as const;

export const complaintAnalytics = [
  { label: "UPI fraud", value: 46 },
  { label: "Phishing", value: 28 },
  { label: "Deepfake", value: 14 },
  { label: "Loan scam", value: 12 },
] as const;

export const reportHighlights = [
  {
    label: "Threat score",
    value: "91 / 100",
    note: "Critical, multiple connected complaints",
  },
  {
    label: "Known aliases",
    value: "5",
    note: "Shared handles and spoofed branding",
  },
  {
    label: "Evidence count",
    value: "12",
    note: "OSINT, complaint history, and timeline",
  },
  {
    label: "Suggested action",
    value: "Escalate",
    note: "Bank + cyber cell coordination",
  },
] as const;
