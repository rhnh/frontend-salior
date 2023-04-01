import type { Taxonomy } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";
import { paginationPipeLine, randomBirdPipe, unApprovedPipe2 } from "./taxonomyPipe.server";

export async function createTaxonomy(
  taxonomy: Exclude<Taxonomy, "id" | "createdAt">
) {
  return prisma.taxonomy.create({
    data: { ...taxonomy, isApproved: false },
  });
}

export async function setApproved({
  id,
  isApproved,
}: Pick<Taxonomy, "isApproved" | "id">) {
  return prisma.taxonomy.update({ where: { id }, data: { isApproved } });
}

export async function getTaxonomyById(id: string) {
  return prisma.taxonomy.findUnique({ where: { id } });
}

export async function getTaxonomyPaginated(pageNumber = 1, limit = 5) {
  const pipeline = paginationPipeLine(pageNumber, limit);
  return prisma.taxonomy.aggregateRaw({ pipeline });
}

export async function getUnApproved() {
  const pipeline = unApprovedPipe2
  return prisma.user.aggregateRaw({
    pipeline
  });
}


export const getRandomTaxonomy = async () => {
  return prisma.taxonomy.aggregateRaw({ pipeline: randomBirdPipe })
}

export const updateTaxonomy = async (t: Taxonomy) => {
  const { id, ...rest } = t;
  return prisma.taxonomy.update({ where: { id }, data: { ...rest } })
}