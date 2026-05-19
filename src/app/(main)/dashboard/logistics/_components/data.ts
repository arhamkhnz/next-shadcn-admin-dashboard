import { BriefcaseBusiness, Package, ThermometerSun, Truck, Weight } from "lucide-react";

export type ShipmentStatus =
  | "Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Customs Hold";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";

export type ShipmentLocation = {
  display: string;
  country: string;
  countryCode: string;
};

export type Shipment = {
  id: string;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
};

export const shipments: Shipment[] = [
  {
    id: "SDA-01-2401",
    origin: {
      display: "CGK Airport",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
    },
    cargo: "Consumer Electronics",
    weight: "2,450 kg",
    eta: "08:45 AM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 65,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-02-2402",
    origin: {
      display: "Surabaya",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Semarang",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Industrial Machinery",
    weight: "8,120 kg",
    eta: "11:20 AM",
    etaMeta: "Tomorrow",
    status: "Delayed",
    progress: 42,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-03-2403",
    origin: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
    },
    cargo: "Frozen Seafood",
    weight: "19,800 kg",
    eta: "09:15 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-04-2404",
    origin: {
      display: "KUL Airport",
      country: "Malaysia",
      countryCode: "MY",
    },
    destination: {
      display: "BKK Airport",
      country: "Thailand",
      countryCode: "TH",
    },
    cargo: "Pharmaceutical Kits",
    weight: "540 kg",
    eta: "06:10 PM",
    etaMeta: "Today",
    status: "On Hold",
    progress: 28,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-05-2405",
    origin: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Yogyakarta",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Textiles",
    weight: "1,380 kg",
    eta: "09:30 AM",
    etaMeta: "Friday",
    status: "Scheduled",
    progress: 12,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-06-2406",
    origin: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
    },
    destination: {
      display: "Laem Chabang Port",
      country: "Thailand",
      countryCode: "TH",
    },
    cargo: "Construction Materials",
    weight: "27,400 kg",
    eta: "03:40 PM",
    etaMeta: "Departing Today",
    status: "Scheduled",
    progress: 18,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-07-2407",
    origin: {
      display: "HKG Airport",
      country: "Hong Kong",
      countryCode: "HK",
    },
    destination: {
      display: "MNL Airport",
      country: "Philippines",
      countryCode: "PH",
    },
    cargo: "Medical Devices",
    weight: "860 kg",
    eta: "Pending",
    etaMeta: "Customs",
    status: "Customs Hold",
    progress: 33,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-08-2408",
    origin: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Retail Apparel",
    weight: "620 kg",
    eta: "02:15 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 88,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-09-2409",
    origin: {
      display: "Shanghai Port",
      country: "China",
      countryCode: "CN",
    },
    destination: {
      display: "Busan Port",
      country: "South Korea",
      countryCode: "KR",
    },
    cargo: "Auto Parts",
    weight: "12,200 kg",
    eta: "05:50 PM",
    etaMeta: "Wednesday",
    status: "In Transit",
    progress: 54,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-10-2410",
    origin: {
      display: "NRT Airport",
      country: "Japan",
      countryCode: "JP",
    },
    destination: {
      display: "ICN Airport",
      country: "South Korea",
      countryCode: "KR",
    },
    cargo: "Semiconductor Wafers",
    weight: "320 kg",
    eta: "08:30 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-11-2411",
    origin: {
      display: "Kuala Lumpur",
      country: "Malaysia",
      countryCode: "MY",
    },
    destination: {
      display: "Penang",
      country: "Malaysia",
      countryCode: "MY",
    },
    cargo: "Food Ingredients",
    weight: "3,950 kg",
    eta: "01:05 PM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 71,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-12-2412",
    origin: {
      display: "Cebu Port",
      country: "Philippines",
      countryCode: "PH",
    },
    destination: {
      display: "Davao Port",
      country: "Philippines",
      countryCode: "PH",
    },
    cargo: "Agricultural Produce",
    weight: "6,700 kg",
    eta: "09:40 AM",
    etaMeta: "Friday",
    status: "Delayed",
    progress: 39,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-13-2413",
    origin: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
    },
    destination: {
      display: "DPS Airport",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Luxury Retail Goods",
    weight: "210 kg",
    eta: "07:15 AM",
    etaMeta: "Monday",
    status: "Scheduled",
    progress: 9,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-14-2414",
    origin: {
      display: "Port of Manila",
      country: "Philippines",
      countryCode: "PH",
    },
    destination: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Paper Rolls",
    weight: "15,900 kg",
    eta: "Awaiting Release",
    etaMeta: "Warehouse",
    status: "On Hold",
    progress: 25,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-15-2415",
    origin: {
      display: "Medan",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Pekanbaru",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Beverage Stock",
    weight: "4,500 kg",
    eta: "03:30 PM",
    etaMeta: "Today",
    status: "Scheduled",
    progress: 16,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-16-2416",
    origin: {
      display: "BOM Airport",
      country: "India",
      countryCode: "IN",
    },
    destination: {
      display: "DEL Airport",
      country: "India",
      countryCode: "IN",
    },
    cargo: "Auto Components",
    weight: "780 kg",
    eta: "04:10 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 84,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-17-2417",
    origin: {
      display: "Rotterdam Port",
      country: "Netherlands",
      countryCode: "NL",
    },
    destination: {
      display: "Hamburg Port",
      country: "Germany",
      countryCode: "DE",
    },
    cargo: "Packaging Materials",
    weight: "21,300 kg",
    eta: "Next Week",
    etaMeta: "Tuesday",
    status: "In Transit",
    progress: 62,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-18-2418",
    origin: {
      display: "Ho Chi Minh City",
      country: "Vietnam",
      countryCode: "VN",
    },
    destination: {
      display: "Da Nang",
      country: "Vietnam",
      countryCode: "VN",
    },
    cargo: "Household Appliances",
    weight: "2,060 kg",
    eta: "11:40 AM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-19-2419",
    origin: {
      display: "DXB Airport",
      country: "United Arab Emirates",
      countryCode: "AE",
    },
    destination: {
      display: "JED Airport",
      country: "Saudi Arabia",
      countryCode: "SA",
    },
    cargo: "Temperature Controlled Goods",
    weight: "1,120 kg",
    eta: "10:50 PM",
    etaMeta: "Tonight",
    status: "Delayed",
    progress: 47,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-20-2420",
    origin: {
      display: "Nhava Sheva Port",
      country: "India",
      countryCode: "IN",
    },
    destination: {
      display: "Colombo Port",
      country: "Sri Lanka",
      countryCode: "LK",
    },
    cargo: "Steel Coils",
    weight: "31,800 kg",
    eta: "06:00 AM",
    etaMeta: "Thursday",
    status: "Scheduled",
    progress: 14,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-21-2421",
    origin: {
      display: "Chiang Mai",
      country: "Thailand",
      countryCode: "TH",
    },
    destination: {
      display: "Bangkok",
      country: "Thailand",
      countryCode: "TH",
    },
    cargo: "Furniture",
    weight: "5,240 kg",
    eta: "08:20 AM",
    etaMeta: "Tomorrow",
    status: "In Transit",
    progress: 58,
    mode: "land",
    routeType: "road",
  },
  {
    id: "SDA-22-2422",
    origin: {
      display: "KIX Airport",
      country: "Japan",
      countryCode: "JP",
    },
    destination: {
      display: "TPE Airport",
      country: "Taiwan",
      countryCode: "TW",
    },
    cargo: "Precision Tools",
    weight: "430 kg",
    eta: "Pending",
    etaMeta: "Security",
    status: "On Hold",
    progress: 29,
    mode: "air",
    routeType: "flight",
  },
  {
    id: "SDA-23-2423",
    origin: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
    },
    destination: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
    },
    cargo: "Chemicals",
    weight: "18,600 kg",
    eta: "Departing",
    etaMeta: "02:50 PM",
    status: "Scheduled",
    progress: 19,
    mode: "sea",
    routeType: "ship",
  },
  {
    id: "SDA-24-2424",
    origin: {
      display: "Bandar Lampung",
      country: "Indonesia",
      countryCode: "ID",
    },
    destination: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
    },
    cargo: "Fresh Produce",
    weight: "970 kg",
    eta: "06:20 PM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
  },
];

export const shipmentDetails = [
  { icon: Package, label: "Cargo", value: "Electronics" },
  { icon: Weight, label: "Weight", value: "2,450 kg" },
  { icon: BriefcaseBusiness, label: "Container", value: "40ft HC" },
  { icon: Truck, label: "Reference", value: "PO-88472" },
  { icon: ThermometerSun, label: "Temperature", value: "18°C" },
] as const;

export const shipmentTimeline = [
  { label: "Picked Up", time: "May 12, 07:20 AM", place: "Jakarta, IDN", done: true, active: false },
  { label: "In Transit", time: "May 12, 07:30 AM", place: "Cirebon, IDN", done: false, active: true },
  { label: "At Sort Facility", time: "May 12, 09:15 AM", place: "Semarang, IDN", done: false, active: false },
  { label: "Out for Delivery", time: "May 12, 12:10 PM", place: "Singapore, SGP", done: false, active: false },
  { label: "Delivered", time: "-", place: "Singapore, SGP", done: false, active: false },
] as const;
