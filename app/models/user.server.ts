import type { Role, User } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";
import { authenticated, createHashedPassword } from "~/utils/user.server";
import { userPipeLine } from "./userPipeline.server";

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const isTaken = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (isTaken) return true;
  return false;
};

export const createUser = async ({
  username,
  password,
}: Pick<User, "username" | "password">) => {
  const hashedPassword = await createHashedPassword(password);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword, role: "user" },
  });
  if (newUser) {
    const user = { username, id: newUser.id };
    return user;
  }
  return null;
};

export async function getUser({
  username,
  password,
}: Pick<User, "username" | "password">) {
  const isUser = await prisma.user.findUnique({
    where: { username },
  });
  if (!isUser) return null;

  const isAuthenticated = await authenticated({
    password,
    hashedPassword: isUser.password,
  });
  const user = { username, id: isUser.id };
  if (isAuthenticated) {
    return user;
  }
  return null;
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      username: true,
      id: true,
      role: true,
    },
  });
}

export async function getPaginatedUsers({
  pageNumber,
  limit,
}: {
  limit: number;
  pageNumber: number;
}) {
  const pipeline = userPipeLine({ pageNumber, limit });
  return prisma.user.aggregateRaw({
    pipeline,
  });
}


export async function setRole({ role, id }: { role: Role, id: string }) {
  return prisma.user.update({
    where: {
      id
    },
    data: {
      role
    },
  })
}


export async function changePassword({ id, currentPassword, newPassword }:
  { id: string, currentPassword: string, newPassword: string }): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return false
  }
  const isAuthorizedUser = await authenticated({ password: currentPassword, hashedPassword: user.password });
  if (isAuthorizedUser) {
    const hashedPassword = await createHashedPassword(newPassword);
    const result = await prisma.user.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      }
    })
    if (result) { return true; }
    return false
  }

  return false;
}