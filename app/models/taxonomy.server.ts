import type { Taxonomy } from "@prisma/client";
import { prisma } from "utils/prisma.server";
import { paginationPipeLine } from "./taxonomyPipe.server";
/**
 * @todo add user
 * @param taxonomy
 */
export async function createTaxonomy(
  taxonomy: Exclude<Taxonomy, "id" | "createdAt">
) {
  return prisma.taxonomy.create({
    data: { ...taxonomy, isApproved: false },
  });
}

/**
 *
 * @param
 * @returns
 */
export async function setApproved({
  id,
  isApproved,
}: Pick<Taxonomy, "isApproved" | "id">) {
  return prisma.taxonomy.update({ where: { id }, data: { isApproved } });
}

export async function getById(id: string) {
  return prisma.taxonomy.findUnique({ where: { id } });
}

export async function getTaxonomyPaginated(pageNumber = 1, limit = 5) {
  const pipeline = paginationPipeLine(pageNumber, limit);
  return prisma.taxonomy.aggregateRaw({ pipeline });
}
