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


export const getPosts = async ({ pageNumber = 1, limit = 5, isFeatured = false }:
  { pageNumber: number, limit: number, isFeatured?: boolean }) => {
  const pipeline = postPipeline({ pageNumber, limit, isFeatured })
  return prisma.post.aggregateRaw({ pipeline })
}


export const getPostById = async (id: string) => {
  return prisma.post.findUnique({ where: { id } })
}

export const deletePostById = async (id: string) => {
  return prisma.post.delete({ where: { id } })
}

export const createPost = async ({ title, body, username }:
  { title: string, body: string, username: string }) => {
  return prisma.post.create({
    data: {
      title,
      body,
      username,
      isFeatured: false
    }
  });
}

export const updatePostById = async ({ id, title, body, username }:
  { id: string, title: string, body: string, username: string }) => {
  return prisma.post.update({ where: { id }, data: { title, body, } })
}