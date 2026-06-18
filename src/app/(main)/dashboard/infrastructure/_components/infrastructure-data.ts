import type { SimpleIcon } from "simple-icons";
import { siNextdotjs, siNodedotjs, siReact, siRemix } from "simple-icons";

export interface InfrastructureEnvironment {
  domain: string;
  platform: {
    name: string;
    icon: SimpleIcon;
  };
  environment: "Expired" | "Production" | "Staging";
  status: "Online";
  latency: string;
  uptime: string;
  server: string;
  countryCode: "DE";
  plan: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export interface InfrastructureGroup {
  name: string;
  organization: string;
  online: number;
  rows: InfrastructureEnvironment[];
}

export const infrastructureGroups: InfrastructureGroup[] = [
  {
    name: "Admin Console",
    organization: "Weblabs Studio",
    online: 1,
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/dashboard",
        platform: {
          name: "Next.js",
          icon: siNextdotjs,
        },
        environment: "Expired",
        status: "Online",
        latency: "86ms",
        uptime: "8d 23h",
        server: "Hetzner Cloud",
        countryCode: "DE",
        plan: "CX33, Falkenstein",
        resources: { cpu: 60, ram: 73, disk: 41 },
      },
    ],
  },
  {
    name: "Analytics",
    organization: "Aiy Cap",
    online: 2,
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/analytics",
        platform: {
          name: "React",
          icon: siReact,
        },
        environment: "Production",
        status: "Online",
        latency: "246ms",
        uptime: "9d 23h",
        server: "Hetzner Cloud",
        countryCode: "DE",
        plan: "CX51, Nuremberg",
        resources: { cpu: 49, ram: 42, disk: 44 },
      },
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/reports",
        platform: {
          name: "Remix",
          icon: siRemix,
        },
        environment: "Staging",
        status: "Online",
        latency: "110ms",
        uptime: "9d 23h",
        server: "Hetzner Cloud",
        countryCode: "DE",
        plan: "CX41, Nuremberg",
        resources: { cpu: 37, ram: 46, disk: 64 },
      },
    ],
  },
  {
    name: "Kanban",
    organization: "Storeframe",
    online: 1,
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/kanban",
        platform: {
          name: "Node.js",
          icon: siNodedotjs,
        },
        environment: "Production",
        status: "Online",
        latency: "25ms",
        uptime: "10d 23h",
        server: "Bare Metal / Custom",
        countryCode: "DE",
        plan: "EX101, Falkenstein",
        resources: { cpu: 1, ram: 21, disk: 4 },
      },
    ],
  },
  {
    name: "Inbox",
    organization: "Acme Corp",
    online: 0,
    rows: [],
  },
];
