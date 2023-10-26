import bcrypt from "bcryptjs";
import { getUserById } from "~/models/user.server";
import { getLocalAuthenticatedUserId } from "./session.server";
import { SALT } from "./config.server";
import type { Role } from "@prisma/client";
/**
 * @ Takes regular password and compares with hashedPassword {from data}
 *
 * @returns boolean
 */
export const authenticated = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => await bcrypt.compare(password, hashedPassword);

export const createHashedPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT);

type AuthorizedUser = {
  username: string;
  role: Role;
};
/**
 * gets Username and user role from the session
 * @param request
 * @returns username and role for the user
 */
export async function getLocalAuthenticatedUser(
  request: Request
): Promise<AuthorizedUser | null> {
  const userId = await getLocalAuthenticatedUserId(request);
  if (!userId) {
    return null;
  }
  const user = await getUserById(userId);
  if (!user?.username || user.username === "") {
    return null;
  }
  return {
    username: user.username,
    role: user.role as Role,
  };
}

export const isAuthorizedUser = (role: Role) =>
  role === "admin" || role === "mod";
