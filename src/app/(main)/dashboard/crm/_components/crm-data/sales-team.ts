import { rootUser, users } from "@/data/users";

export interface SalesOwner {
  id: string;
  name: string;
}

export const salesOwners: SalesOwner[] = [
  { id: "arham", name: users[0].name },
  { id: "ammar", name: users[1].name },
  { id: "sofia", name: "Sofia Marchetti" },
  { id: "ethan", name: "Ethan Brooks" },
  { id: "nadia", name: "Nadia Okafor" },
  { id: "lucas", name: "Lucas Moreau" },
  { id: "isla", name: "Isla Grant" },
  { id: "kenji", name: "Kenji Nakamura" },
];

export const currentSalesOwnerId = rootUser.id === "1" ? "arham" : salesOwners[0].id;

export const ownerNameById: ReadonlyMap<string, string> = new Map(salesOwners.map((owner) => [owner.id, owner.name]));

export function getOwnerName(ownerId: string): string {
  return ownerNameById.get(ownerId) ?? ownerId;
}
