export interface CrmCompany {
  id: string;
  name: string;
  primaryContact: string;
  ownerId: string;
}

export const crmCompanies: CrmCompany[] = [
  { id: "c1", name: "Asteron Bioworks", primaryContact: "Cameron Ruiz", ownerId: "arham" },
  { id: "c2", name: "BlueHaven Systems", primaryContact: "Nina Petrova", ownerId: "ammar" },
  { id: "c3", name: "Cinder Health", primaryContact: "Tomas Lindqvist", ownerId: "sofia" },
  { id: "c4", name: "Drift Manufacturing", primaryContact: "Ava Thompson", ownerId: "ethan" },
  { id: "c5", name: "Everline Freight", primaryContact: "Mateo Silva", ownerId: "nadia" },
  { id: "c6", name: "Fieldstone Capital", primaryContact: "Priya Raman", ownerId: "arham" },
  { id: "c7", name: "Granite Studios", primaryContact: "Felix Bauer", ownerId: "lucas" },
  { id: "c8", name: "Halcyon Dynamics", primaryContact: "Hana Sato", ownerId: "isla" },
  { id: "c9", name: "Ironcrest Ventures", primaryContact: "Omar Farouk", ownerId: "kenji" },
  { id: "c10", name: "Juniper Infrastructure", primaryContact: "Lena Kowalski", ownerId: "ammar" },
  { id: "c11", name: "Kestrel Commerce", primaryContact: "Rosa Delgado", ownerId: "sofia" },
  { id: "c12", name: "Lattice Clinical", primaryContact: "Jonas Weber", ownerId: "arham" },
  { id: "c13", name: "Mariner Foods", primaryContact: "Claire Dubois", ownerId: "ethan" },
  { id: "c14", name: "Northfield Energy", primaryContact: "Samira Haddad", ownerId: "nadia" },
  { id: "c15", name: "Quantum Leap Labs", primaryContact: "Derek Holloway", ownerId: "sofia" },
  { id: "c16", name: "Summit Construction", primaryContact: "Aisha Patel", ownerId: "ethan" },
  { id: "c17", name: "Nova Pharmaceuticals", primaryContact: "Liam Gallagher", ownerId: "isla" },
  { id: "c18", name: "Fjord Media Group", primaryContact: "Emma Lindberg", ownerId: "ammar" },
  { id: "c19", name: "Apex Industrial", primaryContact: "Carlos Mendez", ownerId: "lucas" },
  { id: "c20", name: "Sakura Biomedical", primaryContact: "Yuki Tanaka", ownerId: "nadia" },
  { id: "c21", name: "Polaris Tech Ventures", primaryContact: "Mikko Virtanen", ownerId: "arham" },
  { id: "c22", name: "Momentum Digital Agency", primaryContact: "Sara Alonso", ownerId: "kenji" },
  { id: "c23", name: "Cascade Systems", primaryContact: "Jordan Mitchell", ownerId: "ethan" },
  { id: "c24", name: "Veloce Motors Group", primaryContact: "Marco Rossi", ownerId: "arham" },
  { id: "c25", name: "TerraVerde Consulting", primaryContact: "Nina Chen", ownerId: "sofia" },
  { id: "c26", name: "DataSphere Analytics", primaryContact: "Aiden Brooks", ownerId: "ammar" },
  { id: "c27", name: "Nordic Partners Group", primaryContact: "Erik Johansson", ownerId: "nadia" },
  { id: "c28", name: "Lumiere Tech Paris", primaryContact: "Camille Dupont", ownerId: "isla" },
  { id: "c29", name: "Willow Creek HR", primaryContact: "Hannah Collins", ownerId: "lucas" },
  { id: "c30", name: "Horizon Utilities", primaryContact: "Ben Walker", ownerId: "ethan" },
];

export const companyById: ReadonlyMap<string, CrmCompany> = new Map(
  crmCompanies.map((company) => [company.id, company]),
);

export const companyByName: ReadonlyMap<string, CrmCompany> = new Map(
  crmCompanies.map((company) => [company.name, company]),
);
