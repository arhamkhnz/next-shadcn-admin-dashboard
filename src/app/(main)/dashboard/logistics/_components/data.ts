import { BriefcaseBusiness, Package, ThermometerSun, Truck, Weight } from "lucide-react";

export type ShipmentStatus = "In Transit" | "Delayed" | "Delivered";

export type Shipment = {
  id: string;
  from: string;
  to: string;
  cargo: string;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
};

export const shipments: Shipment[] = [
  {
    id: "NXR-2026-0712",
    from: "Jakarta, IDN",
    to: "Singapore, SGP",
    cargo: "Electronics",
    weight: "2,450 kg",
    eta: "08:45",
    etaMeta: "Today",
    status: "In Transit",
  },
  {
    id: "NXR-2026-0711",
    from: "Surabaya, IDN",
    to: "Sydney, AUS",
    cargo: "Machinery",
    weight: "8,120 kg",
    eta: "1:20",
    etaMeta: "PM",
    status: "In Transit",
  },
  {
    id: "NXR-2026-0710",
    from: "Bangkok, THA",
    to: "Ho Chi Minh, VNM",
    cargo: "Furniture",
    weight: "1,120 kg",
    eta: "-",
    etaMeta: "",
    status: "Delayed",
  },
  {
    id: "NXR-2026-0709",
    from: "Manila, PHL",
    to: "Davao, PHL",
    cargo: "Food & Beverages",
    weight: "920 kg",
    eta: "Yesterday",
    etaMeta: "",
    status: "Delivered",
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
