import { getCurrentUserFranchiseId as serverGetCurrentUserFranchiseId } from "@/server/server-actions";

/**
 * Get the franchise ID for the currently logged-in user
 * This is a client-side wrapper that calls the server action
 * @returns The franchise ID or null if the user is not a franchise admin
 */
export async function getCurrentUserFranchiseId(): Promise<string | null> {
  return serverGetCurrentUserFranchiseId();
}
