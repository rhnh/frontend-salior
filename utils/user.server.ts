import bcrypt from "bcryptjs"
const SALT = 12;
export const authenticated = async ({ password, hashedPassword }:
  { password: string, hashedPassword: string }) =>
  await bcrypt.compare(password, hashedPassword)

export const createHashedPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT)
