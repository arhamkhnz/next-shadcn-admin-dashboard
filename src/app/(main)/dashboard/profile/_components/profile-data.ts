interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "Assinado" | "Atual";
  isRestricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Ativo";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Arham Khan",
  preferredName: "Arham",
  legalName: "Arham Khan",
  pronouns: "Ele / dele",
  initials: "AK",
  avatar: "https://avatars.githubusercontent.com/u/43849669",
  engagementStatus: "Ativo",
  jobTitle: "Engenheiro de software",
  jobLevel: "Sênior",
  department: "Produto",
  team: "Produto",
  currentProject: "Agente Autônomo de Lances",
  workEmail: "hello@arhamkhnz.com",
  personalEmail: "arhamkhnz@gmail.com",
  workPhone: "+1 (415) 555-0148",
  workplace: "Remoto",
  timeZone: "UTC+5:30",
  contractorId: "WS-2301",
  startDate: "18 de março de 2022",
  engagementLength: "4 anos, 4 meses",
  employmentType: "Terceirizado",
  weeklyHours: "40 horas",
  schedule: "Segunda–Sexta · 09:00–17:30",
  contractingEntity: "Studio Technologies Pte. Ltd.",
  noticePeriod: "30 dias",
  dateOfBirth: "9 de setembro de 1993",
  address: "1842 Valencia Street, San Francisco, CA 94110",
  emergencyContact: "Ammar K. · Irmão",
  emergencyPhone: "+1 (510) 555-0177",
  manager: {
    name: "Pravi K.",
    role: "Head de Produto",
    initials: "PK",
  },
  bio: "Arham é engenheiro de software no time de produto, construindo software de gestão de lances e licitações, incluindo agentes autônomos de lances que agilizam a descoberta de oportunidades, análise de requisitos, preparação de documentos, verificações de conformidade, precificação e envio. Ele se concentra em transformar fluxos complexos de licitações em produtos confiáveis e fáceis de usar, que ajudam equipes a trabalhar mais rápido e a tomar melhores decisões de lance.",
  leavePolicy: "Cota de licença por contrato",
  annualLeaveAllowance: "25 dias",
  remainingLeave: "18 dias",
  carriedOverLeave: "0 dias",
  usedLeave: "7 dias",
  scheduledLeave: "5 dias",
  pendingLeaveRequests: "0",
  leaveYear: "1º de janeiro a 31 de dezembro de 2026",
  nextLeave: "24 a 28 de agosto de 2026",
  lastWorkingDay: "3 de outubro de 2026",
  updatedBy: "Arham Khan",
  updatedAt: "8 de agosto de 2026",
  documents: [
    {
      id: "doc-1",
      name: "Contrato de terceirização",
      category: "Contrato",
      updatedAt: "18 de março de 2022",
      status: "Assinado",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Acordo de confidencialidade",
      category: "Conformidade",
      updatedAt: "18 de março de 2022",
      status: "Assinado",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Confirmação da política de segurança da informação",
      category: "Política",
      updatedAt: "8 de janeiro de 2026",
      status: "Atual",
      isRestricted: false,
    },
  ],
};
