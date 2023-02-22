import type { Taxonomy } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";
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

export async function getTaxonomyById(id: string) {
  return prisma.taxonomy.findUnique({ where: { id } });
}

export async function getTaxonomyPaginated(pageNumber = 1, limit = 5) {
  const pipeline = paginationPipeLine(pageNumber, limit);
  return prisma.taxonomy.aggregateRaw({ pipeline });
}

export async function getUnApproved() {
  return prisma.user.aggregateRaw({
    pipeline: [
      {
        '$match': {
          '$or': [
            {
              'role': 'admin'
            }, {
              'role': 'mod'
            }
            , {
              'role': 'contributor'
            }
          ]
        }
      }, {
        '$lookup': {
          'from': 'Taxonomy',
          'let': {
            'username': '$username'
          },
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$and': [
                    {
                      '$eq': [
                        '$username', '$$username'
                      ]
                    }, {
                      '$eq': [
                        {
                          '$getField': 'isApproved'
                        }, false
                      ]
                    }
                  ]
                }
              }
            }
          ],
          'as': 'birds'
        }
      }, {
        '$project': {
          'birds': 1,
          '_id': 0
        }
      }, {
        '$unwind': {
          'path': '$birds'
        }
      }
    ]
  });
}


export const getRandomTaxonomy = async () => {
  const count = await prisma.taxonomy.count();
  const random = Math.floor(Math.random() * count);
  return prisma.taxonomy.findMany({
    take: 1,
    skip: random,
    where: {
      rank: 'species',
      isApproved: true,
      // image: { not: "" },
      englishName: { not: undefined, }
      ,
      AND: [{ info: { not: undefined } }, { info: { not: "" } }]
    },
  })
}