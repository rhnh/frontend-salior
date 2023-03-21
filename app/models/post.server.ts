import type { Post } from "@prisma/client";
import { prisma } from "~/utils/prisma.server"
import { postPipeline } from "./postPipeline.server";

export const createUserPost = async (post:
  Pick<Post,
    'body'
    | 'title'
    | 'username'>) => {
  return prisma.post.create({ data: { ...post, isFeatured: false } })
}


export const getPostsByUserId = async (username: string) => {
  return prisma.post.findFirst({ where: { username } })
}

export const setFeaturedPost = async (
  { isFeatured, id }:
    { id: string, isFeatured: boolean }) => {
  return prisma.post.update({ where: { id }, data: { isFeatured } })
}


export const getPaginatedPosts = async ({ pageNumber = 1, limit = 5, isFeatured = false }:
  { pageNumber: number, limit: number, isFeatured?: boolean }) => {
  const pipeline = postPipeline({ pageNumber, limit, isFeatured })
  return prisma.post.aggregateRaw({ pipeline })
}

export const getRecentPosts = async ({ total = 3 }: { total?: number }) => {
  return prisma.post.findMany({ take: total, orderBy: { createdAt: "desc" } })
}

export const getFeaturedPost = async () => {
  return prisma.post.findMany({ take: 10, where: { isFeatured: true }, orderBy: [{ createdAt: "desc" }] })
}



export const getPostById = async (id: string) => {
  return prisma.post.findUnique({ where: { id } })
}

export const deletePostById = async (id: string) => {
  return prisma.post.delete({ where: { id } })
}

export const createPost = async ({ title, body, username, image }:
  { title: string, body: string, username: string, image: string }) => {
  return prisma.post.create({
    data: {
      title,
      body,
      username,
      imageUrl: image,
      isFeatured: false
    }
  });
}

export const updatePostById = async ({ id, title, body, username, imageUrl }:
  { id: string, title: string, body: string, username: string, imageUrl: string }) => {
  return prisma.post.update({ where: { id }, data: { title, body, imageUrl } })
}