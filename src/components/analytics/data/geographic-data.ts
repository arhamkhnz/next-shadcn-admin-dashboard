// Mock data for geographic distribution
export interface RegionData {
  id: string;
  name: string;
  code: string;
  users: number;
  newUsers: number;
  growth: number;
  revenue: number;
  engagementScore: number;
}

// Top regions by user count
export const topRegions: RegionData[] = [
  {
    id: "us",
    name: "United States",
    code: "US",
    users: 45280,
    newUsers: 5230,
    growth: 12.5,
    revenue: 125800,
    engagementScore: 8.7,
  },
  {
    id: "in",
    name: "India",
    code: "IN",
    users: 32150,
    newUsers: 8750,
    growth: 37.2,
    revenue: 42300,
    engagementScore: 7.2,
  },
  {
    id: "gb",
    name: "United Kingdom",
    code: "GB",
    users: 18920,
    newUsers: 1840,
    growth: 8.3,
    revenue: 68500,
    engagementScore: 8.1,
  },
  {
    id: "ca",
    name: "Canada",
    code: "CA",
    users: 12450,
    newUsers: 980,
    growth: 6.5,
    revenue: 45200,
    engagementScore: 7.8,
  },
  {
    id: "au",
    name: "Australia",
    code: "AU",
    users: 9870,
    newUsers: 1240,
    growth: 14.2,
    revenue: 38700,
    engagementScore: 7.5,
  },
  {
    id: "de",
    name: "Germany",
    code: "DE",
    users: 8640,
    newUsers: 920,
    growth: 9.8,
    revenue: 32100,
    engagementScore: 6.9,
  },
];

// World map regions with user density
export const worldRegions = [
  { id: "na", name: "North America", density: 4, users: 62450 },
  { id: "sa", name: "South America", density: 2, users: 15720 },
  { id: "eu", name: "Europe", density: 3, users: 48760 },
  { id: "af", name: "Africa", density: 1, users: 8920 },
  { id: "as", name: "Asia", density: 4, users: 89340 },
  { id: "oc", name: "Oceania", density: 2, users: 12450 },
];

// City-level data
export const cityData = [
  { name: "New York", country: "United States", users: 12450, growth: 8.5 },
  { name: "London", country: "United Kingdom", users: 10280, growth: 6.2 },
  { name: "Mumbai", country: "India", users: 9870, growth: 22.5 },
  { name: "Sydney", country: "Australia", users: 5840, growth: 10.8 },
  { name: "Toronto", country: "Canada", users: 5320, growth: 7.4 },
  { name: "Berlin", country: "Germany", users: 4980, growth: 9.2 },
  { name: "Paris", country: "France", users: 4750, growth: 8.1 },
  { name: "São Paulo", country: "Brazil", users: 4520, growth: 28.6 },
  { name: "Tokyo", country: "Japan", users: 4320, growth: 3.5 },
  { name: "Mexico City", country: "Mexico", users: 3840, growth: 18.7 },
];
