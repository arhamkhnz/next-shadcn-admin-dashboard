import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  email: z.string().email(),
  status: z.enum(["Active", "Suspended", "Pending"]),
  role: z.enum(["User", "Moderator", "Admin"]),
  joined: z.string(),
});

export type UserRow = z.infer<typeof userSchema>;
