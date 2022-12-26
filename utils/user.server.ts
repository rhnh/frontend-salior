import { redirect, } from "@remix-run/node";
import bcrypt from "bcryptjs"
import { getUserById } from "~/models/user.server";
import { getLocalAuthorizedUserId } from "./session.server";
import type { TypedResponse } from "@remix-run/node";
import { SALT } from "./config.server";
import type { Role, User } from "@prisma/client";


export const authenticated = async ({ password, hashedPassword }:
  { password: string, hashedPassword: string }) =>
  await bcrypt.compare(password, hashedPassword)

export const createHashedPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT)



type AuthorizedUser = {
  username: string,
  role: Role
}
/**
 * gets Username and user role from the session
 * @param request 
 * @returns username and role for the user
 */
export async function getLocalAuthorizedUser(request: Request):
  Promise<AuthorizedUser | null> {
  const userId = await getLocalAuthorizedUserId(request);
  if (!userId) {
    return null
  }
  const user = await getUserById(userId);
  if (!user?.username || user.username === '') {
    return null
  }
  return {
    username: user.username,
    role: user.role as Role
  }
}

