import type {
  Deal,
  DealActivity,
  DealHealth,
  DealNote,
  DealPriority,
  DealProduct,
  DealSource,
  DealStage,
  DealTask,
} from "./schema";

const today = new Date(2026, 7, 16);

function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function d(
  id: string,
  name: string,
  companyId: string,
  primaryContactId: string,
  stage: DealStage,
  value: number,
  probability: number,
  health: DealHealth,
  priority: DealPriority,
  ownerId: string,
  source: DealSource,
  expectedCloseDate: string | null,
  createdAt: string,
  tags?: string[],
  lastActivityDaysAgo?: number,
  nextActivityDaysFromNow?: number,
  actualCloseDate?: string | null,
  lostReason?: string,
): Deal {
  const deal: Deal = {
    id,
    name,
    companyId,
    primaryContactId,
    stage,
    value,
    currency: "USD",
    probability,
    health,
    priority,
    ownerId,
    source,
    expectedCloseDate,
    actualCloseDate: actualCloseDate ?? null,
    lastActivityDate: lastActivityDaysAgo != null ? daysAgo(lastActivityDaysAgo) : null,
    nextActivityDate: nextActivityDaysFromNow != null ? daysFromNow(nextActivityDaysFromNow) : null,
    createdAt,
    activities: [],
    tasks: [],
    notes: [],
    products: [],
  };
  if (tags) deal.tags = tags;
  if (lostReason) deal.lostReason = lostReason;
  return deal;
}

// ── Enrichment helpers ───────────────────────────────────────────────────

const owners = ["arham", "ammar", "sofia", "ethan", "nadia", "lucas", "isla", "kenji"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

const activityTypes = ["email", "call", "meeting", "note", "status_change", "task", "assignment"] as const;

const activityTitles: Record<string, string[]> = {
  email: [
    "Sent proposal follow-up",
    "Shared pricing breakdown",
    "Responded to technical questions",
    "Sent case study",
    "Outlined implementation plan",
    "Shared product roadmap",
  ],
  call: [
    "Discovery call completed",
    "Requirements gathering session",
    "Pricing discussion",
    "Executive alignment call",
    "Technical deep-dive",
    "Stakeholder review",
  ],
  meeting: [
    "Product demo",
    "Stakeholder presentation",
    "Onboarding planning session",
    "Contract review meeting",
    "Architecture workshop",
    "QBR preparation call",
  ],
  note: [
    "Competitor mentioned pricing concerns",
    "Decision timeline moved up",
    "Budget approved for Q4",
    "Key stakeholder changed",
    "Evaluation criteria updated",
    "Procurement process started",
  ],
  status_change: [
    "Stage advanced from Discovery to Qualified",
    "Stage advanced from Qualified to Proposal Sent",
    "Stage advanced from Proposal Sent to Negotiation",
    "Health changed to Attention",
    "Health changed to Healthy",
    "Priority updated to High",
  ],
  task: [
    "Follow-up task created",
    "Document review scheduled",
    "Technical assessment assigned",
    "Proposal deadline set",
    "Demo preparation completed",
  ],
  assignment: ["Deal assigned to owner", "Deal transferred from team member", "Co-owner added"],
};

function buildActivities(deal: Deal): DealActivity[] {
  const h = hash(deal.id);
  const created = deal.createdAt;
  const createdDate = new Date(created);

  const activities: DealActivity[] = [];

  activities.push({
    id: `${deal.id}-act-0`,
    type: "creation",
    title: "Deal created",
    description: `Deal opened for ${deal.name}`,
    date: created,
    createdBy: deal.ownerId,
  });

  if (deal.ownerId) {
    activities.push({
      id: `${deal.id}-act-1`,
      type: "assignment",
      title: "Owner assigned",
      description: `Assigned to ${deal.ownerId}`,
      date: created,
      createdBy: deal.ownerId,
    });
  }

  const stageOrder: DealStage[] = [
    "Discovery",
    "Qualified",
    "Proposal Sent",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];
  const currentIdx = stageOrder.indexOf(deal.stage);
  const activityCount = Math.min(currentIdx + 1 + (h % 3), 6);

  for (let i = 0; i < activityCount; i++) {
    const type = pick(activityTypes, h + i);
    const titles = activityTitles[type] ?? activityTitles.email;
    const title = pick(titles, h + i + 10);
    const dayOffset = Math.max(1, 3 + i * 4 + (h % 5));
    const date = new Date(createdDate);
    date.setDate(date.getDate() + dayOffset);
    const activityDate = date.toISOString().slice(0, 10);

    let description: string | undefined;
    if (type === "email") {
      description = `Sent to stakeholder regarding ${deal.name}`;
    } else if (type === "call") {
      description = `Discussed requirements and timeline with company team`;
    } else if (type === "meeting") {
      description = `Attended by deal owner and company stakeholders`;
    } else if (type === "note") {
      description = `Internal note: ${title.toLowerCase()}`;
    }

    activities.push({
      id: `${deal.id}-act-${i + 2}`,
      type,
      title,
      description,
      date: activityDate,
      createdBy: pick(owners, h + i + 20),
    });
  }

  return activities;
}

function buildTasks(deal: Deal): DealTask[] {
  const h = hash(deal.id);
  const isClosed = deal.stage === "Closed Won" || deal.stage === "Closed Lost";
  const count = isClosed ? 0 : 1 + (h % 3);

  const taskTitles = [
    "Send follow-up email",
    "Schedule product demo",
    "Prepare proposal document",
    "Review contract terms",
    "Collect technical requirements",
    "Conduct stakeholder meeting",
    "Share pricing sheet",
    "Arrange executive briefing",
    "Complete security review",
    "Update deal forecast",
  ];

  const priorities = ["Low", "Medium", "High"] as const;
  const statuses: ("pending" | "in_progress" | "completed")[] = isClosed
    ? ["completed"]
    : ["pending", "in_progress", "pending"];

  const tasks: DealTask[] = [];
  for (let i = 0; i < count; i++) {
    const status = isClosed ? "completed" : pick(statuses, h + i);
    const dayOffset = status === "completed" ? -(h % 5) : 2 + i * 3 + (h % 4);
    const dueDate = dayOffset < 0 ? daysAgo(Math.abs(dayOffset)) : daysFromNow(dayOffset);

    tasks.push({
      id: `${deal.id}-task-${i}`,
      title: pick(taskTitles, h + i + 30),
      description: status === "completed" ? "Task completed" : undefined,
      dueDate,
      priority: pick(priorities, h + i + 40),
      status,
      assigneeId: pick(owners, h + i + 50),
      createdAt: deal.createdAt,
    });
  }

  return tasks;
}

function buildNotes(deal: Deal): DealNote[] {
  const h = hash(deal.id);
  const noteTexts = [
    "Initial meeting went well. Company is interested in our enterprise tier and wants a custom demo.",
    "Competitor is also pitching. Need to highlight our unique integration capabilities.",
    "Budget is confirmed for this fiscal year. Procurement team is engaged.",
    "Technical team raised concerns about API rate limits. Need to prepare response.",
    "Decision maker will be out next week. Follow up after their return.",
    "Company recently raised Series C. Good timing for an enterprise deal.",
    "Referred by existing customer. Leverage the relationship.",
    "Evaluation phase is ongoing. Provided sandbox access and documentation.",
  ];

  const isDeal = h % 7 !== 0;
  if (!isDeal) return [];

  const count = 1 + (h % 3);
  const notes: DealNote[] = [];
  for (let i = 0; i < count; i++) {
    notes.push({
      id: `${deal.id}-note-${i}`,
      content: pick(noteTexts, h + i + 60),
      authorId: pick(owners, h + i + 70),
      pinned: i === 0,
      createdAt: daysAgo(30 - i * 10 + (h % 5)),
    });
  }
  return notes;
}

function buildProducts(deal: Deal): DealProduct[] {
  const h = hash(deal.id);
  if (deal.value < 25000) return [];

  const catalog = [
    { name: "Platform License (Annual)", unitPrice: 18000 },
    { name: "Analytics Add-on", unitPrice: 12000 },
    { name: "API Premium Access", unitPrice: 8000 },
    { name: "Implementation Service", unitPrice: 15000 },
    { name: "Training & Onboarding", unitPrice: 5000 },
    { name: "Dedicated Support Plan", unitPrice: 9000 },
    { name: "Custom Integration", unitPrice: 20000 },
    { name: "Compliance Module", unitPrice: 10000 },
  ];

  const count = 2 + (h % 3);
  const products: DealProduct[] = [];
  let remaining = deal.value;

  for (let i = 0; i < count && remaining > 0; i++) {
    const item = pick(catalog, h + i + 80);
    const qty = 1 + ((h + i) % 2);
    const unitPrice = item.unitPrice;
    const lineTotal = unitPrice * qty;
    if (lineTotal > remaining && i > 0) continue;
    remaining -= lineTotal;
    products.push({ name: item.name, quantity: qty, unitPrice });
  }

  return products;
}

function enrichDeal(deal: Deal): Deal {
  return {
    ...deal,
    activities: buildActivities(deal),
    tasks: buildTasks(deal),
    notes: buildNotes(deal),
    products: buildProducts(deal),
  };
}

// ── Raw deals ────────────────────────────────────────────────────────────

const rawDeals: Deal[] = [
  // ── Discovery ───────────────────────────────────────────────────────
  d(
    "dl-001",
    "CRM Enterprise License",
    "c4",
    "con-004",
    "Discovery",
    42000,
    10,
    "Healthy",
    "Medium",
    "ethan",
    "Outbound",
    daysFromNow(60),
    daysAgo(7),
    ["enterprise", "industrial"],
    7,
    5,
  ),
  d(
    "dl-002",
    "Portfolio CRM Package",
    "c21",
    "con-078",
    "Discovery",
    35000,
    10,
    "Healthy",
    "High",
    "arham",
    "Event",
    daysFromNow(45),
    daysAgo(1),
    ["startup", "portfolio"],
    1,
    3,
  ),
  d(
    "dl-003",
    "Analytics Add-on",
    "c13",
    "con-013",
    "Discovery",
    58000,
    15,
    "Healthy",
    "Low",
    "ethan",
    "Event",
    daysFromNow(50),
    daysAgo(4),
    ["food", "distribution"],
    4,
    7,
  ),
  d(
    "dl-004",
    "Starter Tier Annual",
    "c25",
    "con-082",
    "Discovery",
    28000,
    15,
    "Healthy",
    "Low",
    "sofia",
    "Referral",
    daysFromNow(30),
    daysAgo(3),
    ["sustainability"],
    3,
    5,
  ),
  d(
    "dl-005",
    "Mobile CRM Pilot",
    "c14",
    "con-014",
    "Discovery",
    72000,
    10,
    "Attention",
    "High",
    "nadia",
    "Outbound",
    daysFromNow(40),
    daysAgo(2),
    ["energy", "mobile"],
    2,
    3,
  ),
  d(
    "dl-006",
    "Agency Platform License",
    "c22",
    "con-079",
    "Discovery",
    18000,
    10,
    "Healthy",
    "Low",
    "kenji",
    "Website",
    daysFromNow(45),
    daysAgo(4),
    ["agency"],
    4,
    7,
  ),

  // ── Qualified ───────────────────────────────────────────────────────
  d(
    "dl-007",
    "Enterprise Multi-Entity",
    "c9",
    "con-009",
    "Qualified",
    340000,
    25,
    "Healthy",
    "Critical",
    "kenji",
    "Referral",
    daysFromNow(30),
    daysAgo(1),
    ["enterprise", "international", "venture-capital"],
    1,
    2,
  ),
  d(
    "dl-008",
    "Enterprise CRM Suite",
    "c6",
    "con-006",
    "Qualified",
    198000,
    25,
    "Healthy",
    "High",
    "arham",
    "Event",
    daysFromNow(30),
    daysAgo(1),
    ["fintech", "compliance"],
    1,
    4,
  ),
  d(
    "dl-009",
    "Seoul Office Expansion",
    "c20",
    "con-077",
    "Qualified",
    82000,
    30,
    "Healthy",
    "Medium",
    "nadia",
    "Partner",
    daysFromNow(30),
    daysAgo(2),
    ["biotech", "international"],
    2,
    5,
  ),
  d(
    "dl-010",
    "Compliance Module",
    "c17",
    "con-074",
    "Qualified",
    65000,
    25,
    "Attention",
    "Medium",
    "isla",
    "Partner",
    daysFromNow(25),
    daysAgo(1),
    ["pharma", "compliance"],
    1,
    7,
  ),
  d(
    "dl-011",
    "Platform Expansion",
    "c2",
    "con-002",
    "Qualified",
    45000,
    25,
    "Healthy",
    "Medium",
    "ammar",
    "Referral",
    daysFromNow(21),
    daysAgo(15),
    ["saas", "expansion"],
    15,
    6,
  ),
  d(
    "dl-012",
    "API Premium Add-on",
    "c2",
    "con-002",
    "Qualified",
    42500,
    20,
    "Healthy",
    "Low",
    "ammar",
    "Referral",
    daysFromNow(35),
    daysAgo(5),
    ["saas", "api"],
    5,
    10,
  ),
  d(
    "dl-013",
    "Pilot Program",
    "c3",
    "con-003",
    "Qualified",
    65000,
    30,
    "Attention",
    "High",
    "sofia",
    "Inbound",
    daysFromNow(14),
    daysAgo(10),
    ["healthcare", "pilot"],
    10,
    3,
  ),
  d(
    "dl-014",
    "Advanced Analytics Add-on",
    "c26",
    "con-083",
    "Qualified",
    42000,
    25,
    "Healthy",
    "Medium",
    "ammar",
    "Inbound",
    daysFromNow(20),
    daysAgo(4),
    ["analytics", "data"],
    4,
    5,
  ),

  // ── Proposal Sent ───────────────────────────────────────────────────
  d(
    "dl-015",
    "2-Year Renewal + Analytics",
    "c12",
    "con-012",
    "Proposal Sent",
    89000,
    50,
    "Healthy",
    "High",
    "arham",
    "Partner",
    daysFromNow(10),
    daysAgo(3),
    ["renewal", "analytics"],
    3,
    2,
  ),
  d(
    "dl-016",
    "Reporting Module",
    "c23",
    "con-080",
    "Proposal Sent",
    52000,
    50,
    "Healthy",
    "Medium",
    "ethan",
    "Inbound",
    daysFromNow(14),
    daysAgo(5),
    ["cloud", "reporting"],
    5,
    3,
  ),
  d(
    "dl-017",
    "APAC Expansion",
    "c17",
    "con-074",
    "Proposal Sent",
    120000,
    45,
    "Healthy",
    "High",
    "isla",
    "Partner",
    daysFromNow(14),
    daysAgo(8),
    ["pharma", "international"],
    8,
    4,
  ),
  d(
    "dl-018",
    "Platform Expansion",
    "c2",
    "con-002",
    "Proposal Sent",
    45000,
    50,
    "Attention",
    "Medium",
    "ammar",
    "Referral",
    daysFromNow(12),
    daysAgo(15),
    ["saas"],
    15,
    5,
  ),
  d(
    "dl-019",
    "Starter Tier Annual",
    "c25",
    "con-082",
    "Proposal Sent",
    28000,
    45,
    "Healthy",
    "Low",
    "sofia",
    "Referral",
    daysFromNow(10),
    daysAgo(3),
    ["sustainability"],
    3,
    4,
  ),
  d(
    "dl-020",
    "Enterprise Analytics Bundle",
    "c1",
    "con-001",
    "Proposal Sent",
    125000,
    50,
    "Healthy",
    "High",
    "arham",
    "Inbound",
    daysFromNow(7),
    daysAgo(5),
    ["enterprise", "analytics"],
    5,
    2,
  ),

  // ── Negotiation ─────────────────────────────────────────────────────
  d(
    "dl-021",
    "Enterprise Multi-Entity",
    "c9",
    "con-009",
    "Negotiation",
    340000,
    70,
    "Attention",
    "Critical",
    "kenji",
    "Referral",
    daysFromNow(14),
    daysAgo(1),
    ["enterprise", "international"],
    1,
    1,
  ),
  d(
    "dl-022",
    "Enterprise CRM Suite",
    "c6",
    "con-006",
    "Negotiation",
    198000,
    65,
    "Healthy",
    "High",
    "arham",
    "Event",
    daysFromNow(21),
    daysAgo(1),
    ["fintech", "compliance"],
    1,
    3,
  ),
  d(
    "dl-023",
    "Distribution Module",
    "c13",
    "con-013",
    "Negotiation",
    98000,
    60,
    "Healthy",
    "High",
    "ethan",
    "Event",
    daysFromNow(15),
    daysAgo(4),
    ["food", "distribution"],
    4,
    2,
  ),
  d(
    "dl-024",
    "Quality Management Module",
    "c19",
    "con-076",
    "Negotiation",
    68000,
    65,
    "Healthy",
    "Medium",
    "lucas",
    "Inbound",
    daysFromNow(14),
    daysAgo(3),
    ["manufacturing", "quality"],
    3,
    2,
  ),
  d(
    "dl-025",
    "Enterprise Analytics Bundle",
    "c1",
    "con-001",
    "Negotiation",
    125000,
    70,
    "Healthy",
    "High",
    "arham",
    "Inbound",
    daysFromNow(10),
    daysAgo(2),
    ["enterprise", "analytics"],
    2,
    1,
  ),

  // ── Closed Won ──────────────────────────────────────────────────────
  d(
    "dl-026",
    "Base Platform",
    "c1",
    "con-001",
    "Closed Won",
    210000,
    100,
    "Healthy",
    "Critical",
    "arham",
    "Inbound",
    null,
    daysAgo(365),
    ["enterprise"],
    30,
    undefined,
    daysAgo(30),
  ),
  d(
    "dl-027",
    "Base Subscription",
    "c2",
    "con-002",
    "Closed Won",
    64000,
    100,
    "Healthy",
    "Medium",
    "ammar",
    "Referral",
    null,
    daysAgo(400),
    ["saas"],
    40,
    undefined,
    daysAgo(35),
  ),
  d(
    "dl-028",
    "Annual Renewal",
    "c5",
    "con-005",
    "Closed Won",
    160000,
    100,
    "Healthy",
    "High",
    "nadia",
    "Partner",
    null,
    daysAgo(400),
    ["logistics"],
    30,
    undefined,
    daysAgo(10),
  ),
  d(
    "dl-029",
    "Original License",
    "c8",
    "con-008",
    "Closed Won",
    78000,
    100,
    "Healthy",
    "Medium",
    "isla",
    "Inbound",
    null,
    daysAgo(500),
    ["technology"],
    20,
    undefined,
    daysAgo(120),
  ),
  d(
    "dl-030",
    "Base Platform (EMEA)",
    "c17",
    "con-074",
    "Closed Won",
    120000,
    100,
    "Healthy",
    "High",
    "isla",
    "Partner",
    null,
    daysAgo(520),
    ["pharma", "international"],
    25,
    undefined,
    daysAgo(45),
  ),
  d(
    "dl-031",
    "Base Platform",
    "c19",
    "con-076",
    "Closed Won",
    145000,
    100,
    "Healthy",
    "High",
    "lucas",
    "Inbound",
    null,
    daysAgo(410),
    ["manufacturing"],
    20,
    undefined,
    daysAgo(30),
  ),
  d(
    "dl-032",
    "Base Platform",
    "c20",
    "con-077",
    "Closed Won",
    56000,
    100,
    "Healthy",
    "Medium",
    "nadia",
    "Partner",
    null,
    daysAgo(290),
    ["biotech"],
    15,
    undefined,
    daysAgo(25),
  ),
  d(
    "dl-033",
    "Base Platform",
    "c23",
    "con-080",
    "Closed Won",
    88000,
    100,
    "Healthy",
    "Medium",
    "ethan",
    "Inbound",
    null,
    daysAgo(310),
    ["cloud"],
    15,
    undefined,
    daysAgo(20),
  ),
  d(
    "dl-034",
    "Base Platform",
    "c26",
    "con-083",
    "Closed Won",
    65000,
    100,
    "Healthy",
    "Low",
    "ammar",
    "Inbound",
    null,
    daysAgo(220),
    ["analytics"],
    10,
    undefined,
    daysAgo(15),
  ),
  d(
    "dl-035",
    "Original Enterprise License",
    "c24",
    "con-081",
    "Closed Won",
    210000,
    100,
    "Healthy",
    "Critical",
    "arham",
    "Partner",
    null,
    daysAgo(550),
    ["automotive", "international"],
    30,
    undefined,
    daysAgo(120),
  ),
  d(
    "dl-036",
    "Original License",
    "c16",
    "con-073",
    "Closed Won",
    45000,
    100,
    "Healthy",
    "Low",
    "ethan",
    "Referral",
    null,
    daysAgo(340),
    ["construction"],
    10,
    undefined,
    daysAgo(90),
  ),

  // ── Closed Lost ─────────────────────────────────────────────────────
  d(
    "dl-037",
    "CRM Enterprise License",
    "c4",
    "con-004",
    "Closed Lost",
    42000,
    0,
    "At Risk",
    "Medium",
    "ethan",
    "Outbound",
    null,
    daysAgo(90),
    ["enterprise"],
    5,
    undefined,
    daysAgo(20),
    "Budget constraints — project deferred to Q1 2027",
  ),
  d(
    "dl-038",
    "Seoul Office Expansion",
    "c20",
    "con-077",
    "Closed Lost",
    82000,
    0,
    "At Risk",
    "High",
    "nadia",
    "Partner",
    null,
    daysAgo(60),
    ["biotech", "international"],
    3,
    undefined,
    daysAgo(10),
    "Chose competitor with native Japanese localization",
  ),
  d(
    "dl-039",
    "Pilot Program",
    "c3",
    "con-003",
    "Closed Lost",
    65000,
    0,
    "At Risk",
    "High",
    "sofia",
    "Inbound",
    null,
    daysAgo(45),
    ["healthcare"],
    5,
    undefined,
    daysAgo(8),
    "Selected alternative vendor for faster deployment",
  ),
  d(
    "dl-040",
    "Advanced Analytics Add-on",
    "c26",
    "con-083",
    "Closed Lost",
    42000,
    0,
    "At Risk",
    "Medium",
    "ammar",
    "Inbound",
    null,
    daysAgo(120),
    ["analytics"],
    4,
    undefined,
    daysAgo(60),
    "Internal data team built custom solution",
  ),
  d(
    "dl-041",
    "Platform Expansion",
    "c2",
    "con-002",
    "Closed Lost",
    45000,
    0,
    "At Risk",
    "Medium",
    "ammar",
    "Referral",
    null,
    daysAgo(80),
    ["saas"],
    6,
    undefined,
    daysAgo(30),
    "Company downsized — expansion no longer needed",
  ),

  // ── Closing this month / overdue ────────────────────────────────────
  d(
    "dl-042",
    "2-Year Renewal + Analytics",
    "c12",
    "con-012",
    "Negotiation",
    89000,
    80,
    "Healthy",
    "Critical",
    "arham",
    "Partner",
    daysFromNow(-2),
    daysAgo(3),
    ["renewal"],
    3,
    1,
  ),
  d(
    "dl-043",
    "Enterprise Analytics Bundle",
    "c1",
    "con-001",
    "Negotiation",
    125000,
    75,
    "Healthy",
    "High",
    "arham",
    "Inbound",
    daysFromNow(5),
    daysAgo(2),
    ["enterprise", "analytics"],
    2,
    1,
  ),
  d(
    "dl-044",
    "Distribution Module",
    "c13",
    "con-013",
    "Negotiation",
    98000,
    60,
    "Attention",
    "High",
    "ethan",
    "Event",
    daysFromNow(8),
    daysAgo(4),
    ["food", "distribution"],
    4,
    2,
  ),
  d(
    "dl-045",
    "Reporting Module",
    "c23",
    "con-080",
    "Proposal Sent",
    52000,
    50,
    "Healthy",
    "Medium",
    "ethan",
    "Inbound",
    daysFromNow(3),
    daysAgo(5),
    ["cloud"],
    5,
    3,
  ),

  // ── More variety ────────────────────────────────────────────────────
  d(
    "dl-046",
    "Compliance Module",
    "c17",
    "con-074",
    "Qualified",
    65000,
    25,
    "Attention",
    "High",
    "isla",
    "Partner",
    daysFromNow(25),
    daysAgo(1),
    ["pharma", "compliance"],
    1,
    7,
  ),
  d(
    "dl-047",
    "Mobile CRM Pilot",
    "c14",
    "con-014",
    "Qualified",
    72000,
    20,
    "At Risk",
    "High",
    "nadia",
    "Outbound",
    daysFromNow(20),
    daysAgo(2),
    ["energy", "mobile"],
    2,
    5,
  ),
  d(
    "dl-048",
    "Agency Platform License",
    "c22",
    "con-079",
    "Discovery",
    18000,
    10,
    "Healthy",
    "Low",
    "kenji",
    "Website",
    daysFromNow(50),
    daysAgo(4),
    ["agency"],
    4,
    10,
  ),
  d(
    "dl-049",
    "Enterprise CRM License",
    "c4",
    "con-004",
    "Qualified",
    42000,
    20,
    "Healthy",
    "Medium",
    "ethan",
    "Outbound",
    daysFromNow(35),
    daysAgo(7),
    ["enterprise", "industrial"],
    7,
    5,
  ),
  d(
    "dl-050",
    "Portfolio CRM Package",
    "c21",
    "con-078",
    "Qualified",
    35000,
    20,
    "Healthy",
    "High",
    "arham",
    "Event",
    daysFromNow(30),
    daysAgo(1),
    ["startup", "portfolio"],
    1,
    4,
  ),
];

// ── Special overrides (no primary contact, no timeline, etc.) ────────────

const overrides: Partial<Record<string, { primaryContactId?: string | null; activities?: DealActivity[] }>> = {
  "dl-006": { primaryContactId: null },
  "dl-048": { primaryContactId: null },
  "dl-003": { activities: [] },
  "dl-036": { activities: [] },
};

// ── Enriched export ──────────────────────────────────────────────────────

export const deals: Deal[] = rawDeals.map((deal) => {
  const override = overrides[deal.id];
  const base = override ? { ...deal, ...override } : deal;
  return enrichDeal(base);
});

export const stageOptions: DealStage[] = [
  "Discovery",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export const healthOptions: DealHealth[] = ["Healthy", "Attention", "At Risk"];

export const priorityOptions: DealPriority[] = ["Low", "Medium", "High", "Critical"];

export const sourceOptions: DealSource[] = [
  "Inbound",
  "Outbound",
  "Referral",
  "Partner",
  "Event",
  "Website",
  "Cold Call",
];
