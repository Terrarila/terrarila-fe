import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "./terrala-api";
export async function adminAuthorization() {
  const value = (await cookies()).get("terrala_admin")?.value;
  if (!value) throw new ApiError(401, "LOGIN_REQUIRED");
  return { Authorization: `Bearer ${value}` };
}
