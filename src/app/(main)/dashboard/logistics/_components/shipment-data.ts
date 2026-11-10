import {
  AlertTriangleIcon,
  ArrowUp,
  Ban,
  CheckCircle2,
  Droplets,
  Flame,
  Forklift,
  type LucideIcon,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  Truck,
} from "lucide-react";

export type ShipmentStatus =
  | "Agendado"
  | "Em trânsito"
  | "Saiu para entrega"
  | "Entregue"
  | "Atrasado"
  | "Em pausa"
  | "Retenção aduaneira";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";
export type CustomerTier = "Prioridade" | "Padrão" | "Sem prioridade";

export type GeoCoordinate = [longitude: number, latitude: number];

export type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

export type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabel: string;
};

export type HandlingTag = {
  label: string;
  icon: LucideIcon;
};

export type ShipmentHandling = {
  label: string;
  note: string;
  tags: HandlingTag[];
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
};

const customerAccounts = {
  techCorp: {
    name: "TechCorp",
    initials: "TC",
    id: "SDA-1001-2401-01",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  regionalRoadExpress: {
    name: "Regional Road Express",
    initials: "RR",
    id: "SDA-1002-2402-02",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  sendWell: {
    name: "SendWell B.V.",
    initials: "SW",
    id: "SDA-1003-2403-03",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  sourceDay: {
    name: "SourceDay",
    initials: "SD",
    id: "SDA-1004-2404-04",
    tier: "Padrão",
    tierLabel: "Conta de envios recorrentes",
  },
  shippingEasy: {
    name: "ShippingEasy",
    initials: "SE",
    id: "SDA-1005-2405-05",
    tier: "Padrão",
    tierLabel: "Conta de envios recorrentes",
  },
  freightView: {
    name: "FreightView",
    initials: "FV",
    id: "SDA-1006-2406-06",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  logisticsPlus: {
    name: "Logistics Plus",
    initials: "LP",
    id: "SDA-1007-2407-07",
    tier: "Padrão",
    tierLabel: "Conta de frete gerenciada",
  },
  transvirtual: {
    name: "Transvirtual",
    initials: "TV",
    id: "SDA-1008-2408-08",
    tier: "Padrão",
    tierLabel: "Conta de frete gerenciada",
  },
  skyTrack: {
    name: "SkyTrack",
    initials: "ST",
    id: "SDA-1009-2409-09",
    tier: "Sem prioridade",
    tierLabel: "Conta de envios ocasionais",
  },
  maersk: {
    name: "Maersk",
    initials: "MK",
    id: "SDA-1010-2410-10",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  flexport: {
    name: "Flexport",
    initials: "FX",
    id: "SDA-1011-2411-11",
    tier: "Prioridade",
    tierLabel: "Top 1% por volume de envios",
  },
  piedPiper: {
    name: "Pied Piper",
    initials: "PP",
    id: "SDA-1012-2412-12",
    tier: "Sem prioridade",
    tierLabel: "Conta de envios ocasionais",
  },
} satisfies Record<string, ShipmentCustomer>;

export const shipments: Shipment[] = [
  {
    id: "SDA-01-2401",
    customer: customerAccounts.techCorp,
    origin: {
      display: "Aeroporto CGK",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [106.6429036, -6.1238696],
    },
    destination: {
      display: "Aeroporto SIN",
      country: "Singapura",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    cargo: "Eletrônicos de consumo",
    handling: {
      label: "Eletrônicos frágeis",
      note: "Mantenha a embalagem lacrada até a entrega.",
      tags: [
        { label: "Não empilhar", icon: Ban },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "2.450 kg",
    eta: "08:45",
    etaMeta: "Hoje",
    status: "Em trânsito",
    progress: 65,
    mode: "air",
    routeType: "flight",
    transportNumber: "GA-884",
  },
  {
    id: "SDA-02-2402",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "Surabaya",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [112.7377674, -7.2462836],
    },
    destination: {
      display: "Semarang",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [110.4229104, -6.9903988],
    },
    cargo: "Maquinário industrial",
    handling: {
      label: "Maquinário pesado",
      note: "Fixe o maquinário à base do palete antes do despacho rodoviário.",
      tags: [
        { label: "Somente empilhadeira", icon: Forklift },
        { label: "Carga fixada", icon: ShieldCheck },
        { label: "Não virar", icon: Ban },
      ],
    },
    weight: "8.120 kg",
    eta: "11:20",
    etaMeta: "Amanhã",
    status: "Atrasado",
    progress: 42,
    mode: "land",
    routeType: "road",
    transportNumber: "B 9042 KX",
  },
  {
    id: "SDA-03-2403",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Porto de Tanjung Priok",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    destination: {
      display: "Porto de Singapura",
      country: "Singapura",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    cargo: "Frutos do mar congelados",
    handling: {
      label: "Temperatura controlada",
      note: "Mantenha a cadeia de frio a -18°C ou menos até a entrega no porto.",
      tags: [
        { label: "Registro de temperatura", icon: Thermometer },
        { label: "Manter congelado", icon: Snowflake },
        { label: "Lacre intacto", icon: ShieldCheck },
      ],
    },
    weight: "19.800 kg",
    eta: "21:15",
    etaMeta: "Entregue ontem",
    status: "Entregue",
    progress: 100,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV SEA-318",
  },
  {
    id: "SDA-04-2404",
    customer: customerAccounts.maersk,
    origin: {
      display: "Aeroporto KUL",
      country: "Malásia",
      countryCode: "MY",
      coordinates: [101.7063995, 2.7431274],
    },
    destination: {
      display: "Aeroporto BKK",
      country: "Tailândia",
      countryCode: "TH",
      coordinates: [100.7485803, 13.6818767],
    },
    cargo: "Kits farmacêuticos",
    handling: {
      label: "Temperatura controlada",
      note: "Mantenha a temperatura controlada e verifique a liberação antes da entrega.",
      tags: [
        { label: "Registro de temperatura", icon: Thermometer },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "540 kg",
    eta: "18:10",
    etaMeta: "Hoje",
    status: "Em pausa",
    progress: 28,
    mode: "air",
    routeType: "flight",
    transportNumber: "MH-728",
  },
  {
    id: "SDA-05-2405",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Bandung",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    destination: {
      display: "Yogyakarta",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [110.3672845, -7.7953473],
    },
    cargo: "Têxteis",
    handling: {
      label: "Frete padrão",
      note: "Mantenha as caixas secas e longe da luz solar direta.",
      tags: [
        { label: "Manter seco", icon: Droplets },
        { label: "Não amassar", icon: Ban },
        { label: "Entrega padrão", icon: PackageCheck },
      ],
    },
    weight: "1.380 kg",
    eta: "09:30",
    etaMeta: "Sexta-feira",
    status: "Agendado",
    progress: 12,
    mode: "land",
    routeType: "road",
    transportNumber: "D 1284 YA",
  },
  {
    id: "SDA-06-2406",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Porto Klang",
      country: "Malásia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    destination: {
      display: "Porto de Laem Chabang",
      country: "Tailândia",
      countryCode: "TH",
      coordinates: [100.8994177, 13.0734119],
    },
    cargo: "Materiais de construção",
    handling: {
      label: "Granel pesado",
      note: "Carregue com equipamento de carga pesada e fixe contra deslocamento.",
      tags: [
        { label: "Carga pesada", icon: Forklift },
        { label: "Carga fixada", icon: ShieldCheck },
        { label: "Não empilhar", icon: Ban },
      ],
    },
    weight: "27.400 kg",
    eta: "15:40",
    etaMeta: "Partindo hoje",
    status: "Agendado",
    progress: 18,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV LC-204",
  },
  {
    id: "SDA-07-2407",
    customer: customerAccounts.flexport,
    origin: {
      display: "Aeroporto HKG",
      country: "Hong Kong",
      countryCode: "HK",
      coordinates: [113.9172999, 22.3125986],
    },
    destination: {
      display: "Aeroporto MNL",
      country: "Filipinas",
      countryCode: "PH",
      coordinates: [121.0219223, 14.5122467],
    },
    cargo: "Dispositivos médicos",
    handling: {
      label: "Equipamento médico sensível",
      note: "Mantenha os dispositivos médicos lacrados até a conclusão da inspeção aduaneira.",
      tags: [
        { label: "Lacre intacto", icon: ShieldCheck },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "860 kg",
    eta: "Pendente",
    etaMeta: "Aduana",
    status: "Retenção aduaneira",
    progress: 33,
    mode: "air",
    routeType: "flight",
    transportNumber: "CX-901",
  },
  {
    id: "SDA-08-2408",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Jakarta",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    destination: {
      display: "Bandung",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    cargo: "Vestuário",
    handling: {
      label: "Frete padrão",
      note: "Mantenha as caixas secas e ligue para o destinatário antes da entrega final.",
      tags: [
        { label: "Manter seco", icon: Droplets },
        { label: "Ligar antes da entrega", icon: Truck },
        { label: "Entrega padrão", icon: PackageCheck },
      ],
    },
    weight: "620 kg",
    eta: "14:15",
    etaMeta: "Hoje",
    status: "Saiu para entrega",
    progress: 88,
    mode: "land",
    routeType: "road",
    transportNumber: "B 7712 JKT",
  },
  {
    id: "SDA-09-2409",
    customer: customerAccounts.freightView,
    origin: {
      display: "Porto de Xangai",
      country: "China",
      countryCode: "CN",
      coordinates: [121.4872194, 31.2219444],
    },
    destination: {
      display: "Porto de Busan",
      country: "Coreia do Sul",
      countryCode: "KR",
      coordinates: [129.0492086, 35.1177052],
    },
    cargo: "Peças automotivas",
    handling: {
      label: "Peças industriais",
      note: "Fixe os paletes e proteja as superfícies usinadas da umidade.",
      tags: [
        { label: "Carga fixada", icon: ShieldCheck },
        { label: "Manter seco", icon: Droplets },
        { label: "Somente empilhadeira", icon: Forklift },
      ],
    },
    weight: "12.200 kg",
    eta: "17:50",
    etaMeta: "Quarta-feira",
    status: "Em trânsito",
    progress: 54,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV BUSAN-54",
  },
  {
    id: "SDA-10-2410",
    customer: customerAccounts.techCorp,
    origin: {
      display: "Aeroporto NRT",
      country: "Japão",
      countryCode: "JP",
      coordinates: [140.3933101, 35.7758714],
    },
    destination: {
      display: "Aeroporto ICN",
      country: "Coreia do Sul",
      countryCode: "KR",
      coordinates: [126.4417093, 37.4634593],
    },
    cargo: "Wafers de semicondutores",
    handling: {
      label: "Carga frágil de alto valor",
      note: "Mantenha os wafers lacrados em embalagem com proteção contra choques até a entrega assinada.",
      tags: [
        { label: "Não empilhar", icon: Ban },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "320 kg",
    eta: "20:30",
    etaMeta: "Entregue ontem",
    status: "Entregue",
    progress: 100,
    mode: "air",
    routeType: "flight",
    transportNumber: "KE-704",
  },
  {
    id: "SDA-11-2411",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Kuala Lumpur",
      country: "Malásia",
      countryCode: "MY",
      coordinates: [101.6942371, 3.1516964],
    },
    destination: {
      display: "Penang",
      country: "Malásia",
      countryCode: "MY",
      coordinates: [100.3287352, 5.4141619],
    },
    cargo: "Ingredientes alimentícios",
    handling: {
      label: "Manuseio grau alimentício",
      note: "Mantenha os lacres de grau alimentício intactos e evite contaminação cruzada.",
      tags: [
        { label: "Grau alimentício", icon: PackageCheck },
        { label: "Lacre intacto", icon: ShieldCheck },
        { label: "Manter seco", icon: Droplets },
      ],
    },
    weight: "3.950 kg",
    eta: "13:05",
    etaMeta: "Hoje",
    status: "Em trânsito",
    progress: 71,
    mode: "land",
    routeType: "road",
    transportNumber: "WQH 2184",
  },
  {
    id: "SDA-12-2412",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Porto de Cebu",
      country: "Filipinas",
      countryCode: "PH",
      coordinates: [123.9174564, 10.3054355],
    },
    destination: {
      display: "Porto de Davao",
      country: "Filipinas",
      countryCode: "PH",
      coordinates: [125.6627111, 7.1265272],
    },
    cargo: "Produtos agrícolas",
    handling: {
      label: "Produtos perecíveis",
      note: "Priorize ventilação e inspecione as condições dos produtos no porto.",
      tags: [
        { label: "Perecível", icon: Thermometer },
        { label: "Porão ventilado", icon: PackageCheck },
        { label: "Inspecionar na chegada", icon: CheckCircle2 },
      ],
    },
    weight: "6.700 kg",
    eta: "09:40",
    etaMeta: "Sexta-feira",
    status: "Atrasado",
    progress: 39,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV DAVAO-12",
  },
  {
    id: "SDA-13-2413",
    customer: customerAccounts.flexport,
    origin: {
      display: "Aeroporto SIN",
      country: "Singapura",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    destination: {
      display: "Aeroporto DPS",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [115.1673704, -8.746515],
    },
    cargo: "Produtos de luxo",
    handling: {
      label: "Carga de alto valor",
      note: "Mantenha as caixas lacradas; libere somente ao contato de recebimento autorizado.",
      tags: [
        { label: "Alto valor", icon: Star },
        { label: "Não empilhar", icon: Ban },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "210 kg",
    eta: "07:15",
    etaMeta: "Segunda-feira",
    status: "Agendado",
    progress: 9,
    mode: "air",
    routeType: "flight",
    transportNumber: "SQ-938",
  },
  {
    id: "SDA-14-2414",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Porto de Manila",
      country: "Filipinas",
      countryCode: "PH",
      coordinates: [120.9522815, 14.6038906],
    },
    destination: {
      display: "Porto de Tanjung Priok",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    cargo: "Bobinas de papel",
    handling: {
      label: "Carga sensível à umidade",
      note: "Mantenha as bobinas secas e evite impactos nas bordas durante a descarga.",
      tags: [
        { label: "Manter seco", icon: Droplets },
        { label: "Não virar", icon: Ban },
        { label: "Somente empilhadeira", icon: Forklift },
      ],
    },
    weight: "15.900 kg",
    eta: "Aguardando liberação",
    etaMeta: "Depósito",
    status: "Em pausa",
    progress: 25,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PRI-77",
  },
  {
    id: "SDA-15-2415",
    customer: customerAccounts.skyTrack,
    origin: {
      display: "Medan",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [98.6741623, 3.5894617],
    },
    destination: {
      display: "Pekanbaru",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [101.4515727, 0.5262455],
    },
    cargo: "Estoque de bebidas",
    handling: {
      label: "Frete paletizado padrão",
      note: "Mantenha os paletes na vertical e evite amassar as caixas na transferência rodoviária.",
      tags: [
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Não empilhar", icon: Ban },
        { label: "Entrega padrão", icon: PackageCheck },
      ],
    },
    weight: "4.500 kg",
    eta: "15:30",
    etaMeta: "Hoje",
    status: "Agendado",
    progress: 16,
    mode: "land",
    routeType: "road",
    transportNumber: "BK 4520 RA",
  },
  {
    id: "SDA-16-2416",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "Aeroporto BOM",
      country: "Índia",
      countryCode: "IN",
      coordinates: [72.8638223, 19.0901376],
    },
    destination: {
      display: "Aeroporto DEL",
      country: "Índia",
      countryCode: "IN",
      coordinates: [77.0847985, 28.5553942],
    },
    cargo: "Componentes automotivos",
    handling: {
      label: "Peças industriais",
      note: "Fixe os engradados e inspecione as cintas dos paletes antes da entrega final.",
      tags: [
        { label: "Carga fixada", icon: ShieldCheck },
        { label: "Somente empilhadeira", icon: Forklift },
        { label: "Inspecionar na chegada", icon: CheckCircle2 },
      ],
    },
    weight: "780 kg",
    eta: "16:10",
    etaMeta: "Hoje",
    status: "Saiu para entrega",
    progress: 84,
    mode: "air",
    routeType: "flight",
    transportNumber: "AI-864",
  },
  {
    id: "SDA-17-2417",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Porto de Roterdã",
      country: "Países Baixos",
      countryCode: "NL",
      coordinates: [4.4298268, 51.904333],
    },
    destination: {
      display: "Porto de Hamburgo",
      country: "Alemanha",
      countryCode: "DE",
      coordinates: [9.9118353, 53.5279971],
    },
    cargo: "Materiais de embalagem",
    handling: {
      label: "Frete padrão",
      note: "Mantenha os paletes secos e confira a contagem na descarga.",
      tags: [
        { label: "Manter seco", icon: Droplets },
        { label: "Contar na chegada", icon: CheckCircle2 },
        { label: "Entrega padrão", icon: PackageCheck },
      ],
    },
    weight: "21.300 kg",
    eta: "Próxima semana",
    etaMeta: "Terça-feira",
    status: "Em trânsito",
    progress: 62,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV HAM-902",
  },
  {
    id: "SDA-18-2418",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Ho Chi Minh City",
      country: "Vietnã",
      countryCode: "VN",
      coordinates: [106.7166008, 10.7737261],
    },
    destination: {
      display: "Da Nang",
      country: "Vietnã",
      countryCode: "VN",
      coordinates: [108.212, 16.068],
    },
    cargo: "Eletrodomésticos",
    handling: {
      label: "Carga volumosa e frágil",
      note: "Use duas pessoas no manuseio e mantenha os aparelhos na vertical até a entrega.",
      tags: [
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Não empilhar", icon: Ban },
        { label: "Elevação em dupla", icon: Truck },
      ],
    },
    weight: "2.060 kg",
    eta: "11:40 AM",
    etaMeta: "Entregue hoje",
    status: "Entregue",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "51C-208.44",
  },
  {
    id: "SDA-19-2419",
    customer: customerAccounts.maersk,
    origin: {
      display: "Aeroporto DXB",
      country: "Emirados Árabes Unidos",
      countryCode: "AE",
      coordinates: [55.3666519, 25.2515424],
    },
    destination: {
      display: "Aeroporto JED",
      country: "Arábia Saudita",
      countryCode: "SA",
      coordinates: [39.1634852, 21.6839754],
    },
    cargo: "Produtos refrigerados",
    handling: {
      label: "Temperatura controlada",
      note: "Mantenha a faixa de temperatura e escale exceções de atraso imediatamente.",
      tags: [
        { label: "Registro de temperatura", icon: Thermometer },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Escalar atraso", icon: AlertTriangleIcon },
      ],
    },
    weight: "1.120 kg",
    eta: "22:50",
    etaMeta: "Hoje à noite",
    status: "Atrasado",
    progress: 47,
    mode: "air",
    routeType: "flight",
    transportNumber: "SV-591",
  },
  {
    id: "SDA-20-2420",
    customer: customerAccounts.freightView,
    origin: {
      display: "Porto de Nhava Sheva",
      country: "Índia",
      countryCode: "IN",
      coordinates: [72.952661, 18.9470339],
    },
    destination: {
      display: "Porto de Colombo",
      country: "Sri Lanka",
      countryCode: "LK",
      coordinates: [79.8564409, 6.9646289],
    },
    cargo: "Bobinas de aço",
    handling: {
      label: "Granel pesado",
      note: "Use berços para bobinas e confirme os fixadores antes da liberação.",
      tags: [
        { label: "Carga pesada", icon: Forklift },
        { label: "Carga fixada", icon: ShieldCheck },
        { label: "Não virar", icon: Ban },
      ],
    },
    weight: "31.800 kg",
    eta: "06:00",
    etaMeta: "Quinta-feira",
    status: "Agendado",
    progress: 14,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV COL-620",
  },
  {
    id: "SDA-21-2421",
    customer: customerAccounts.piedPiper,
    origin: {
      display: "Chiang Mai",
      country: "Tailândia",
      countryCode: "TH",
      coordinates: [98.9858802, 18.7882778],
    },
    destination: {
      display: "Bangkok",
      country: "Tailândia",
      countryCode: "TH",
      coordinates: [100.4935089, 13.7524938],
    },
    cargo: "Mobília",
    handling: {
      label: "Carga volumosa e frágil",
      note: "Use embalagem de manta e evite empilhar sobre superfícies acabadas.",
      tags: [
        { label: "Não empilhar", icon: Ban },
        { label: "Manter seco", icon: Droplets },
        { label: "Elevação em dupla", icon: Truck },
      ],
    },
    weight: "5.240 kg",
    eta: "08:20",
    etaMeta: "Amanhã",
    status: "Em trânsito",
    progress: 58,
    mode: "land",
    routeType: "road",
    transportNumber: "กท 8842",
  },
  {
    id: "SDA-22-2422",
    customer: customerAccounts.techCorp,
    origin: {
      display: "Aeroporto KIX",
      country: "Japão",
      countryCode: "JP",
      coordinates: [135.222523, 34.4342045],
    },
    destination: {
      display: "Aeroporto TPE",
      country: "Taiwan",
      countryCode: "TW",
      coordinates: [121.2345977, 25.0793174],
    },
    cargo: "Ferramentas de precisão",
    handling: {
      label: "Carga de precisão de alto valor",
      note: "Mantenha a maleta trancada e lacrada até a liberação de segurança.",
      tags: [
        { label: "Retenção de segurança", icon: ShieldCheck },
        { label: "Lacre intacto", icon: ShieldCheck },
        { label: "Assinatura obrigatória", icon: PenLine },
      ],
    },
    weight: "430 kg",
    eta: "Pendente",
    etaMeta: "Segurança",
    status: "Em pausa",
    progress: 29,
    mode: "air",
    routeType: "flight",
    transportNumber: "BR-129",
  },
  {
    id: "SDA-23-2423",
    customer: customerAccounts.maersk,
    origin: {
      display: "Porto de Singapura",
      country: "Singapura",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    destination: {
      display: "Porto Klang",
      country: "Malásia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    cargo: "Produtos químicos",
    handling: {
      label: "Revisão de materiais perigosos",
      note: "Segurar aguardando revisão de materiais perigosos e liberação no porto.",
      tags: [
        { label: "Revisão de perigosos", icon: Flame },
        { label: "Manter na vertical", icon: ArrowUp },
        { label: "Manuseio restrito", icon: ShieldCheck },
      ],
    },
    weight: "18.600 kg",
    eta: "Partindo",
    etaMeta: "14:50",
    status: "Agendado",
    progress: 19,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PKG-315",
  },
  {
    id: "SDA-24-2424",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Bandar Lampung",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [105.2643742, -5.4460713],
    },
    destination: {
      display: "Jakarta",
      country: "Indonésia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    cargo: "Produtos frescos",
    handling: {
      label: "Produtos perecíveis",
      note: "Priorize a entrega no mesmo dia e mantenha os produtos ventilados.",
      tags: [
        { label: "Perecível", icon: Thermometer },
        { label: "Porão ventilado", icon: PackageCheck },
        { label: "Inspecionar na chegada", icon: CheckCircle2 },
      ],
    },
    weight: "970 kg",
    eta: "18:20",
    etaMeta: "Entregue hoje",
    status: "Entregue",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "BE 1745 YU",
  },
];
