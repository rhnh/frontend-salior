import type { List } from "@prisma/client";

import { prisma } from "utils/prisma.server";

export async function createList(list: Pick<List, "username" | "listname">) {
  return prisma.list.create({ data: list });
}

export async function updateList({
  listname,
  id,
}: Pick<List, "listname" | "id">) {
  return prisma.list.update({
    where: { id },
    data: { listname },
  });
}

export async function getLists() {
  return prisma.list.findMany({
    select: {
      id: true,
      username: true,
      listname: true,
    },
  });
}

export async function addBirdToList({
  listId: id,
  birdId,
  englishName,
  taxonomy = '',
  location = ''
}: {
  listId: string;
  englishName: string;
  birdId?: string;
  location?: string;
  taxonomy: string
}) {
  //if birdId is provided just push
  if (birdId) {
    return prisma.list.update({
      where: { id },
      data: { birds: { push: { birdId: birdId } } }
    })
  }

  //Search if the bird already in Taxonomy, find it and add to the list
  const bird = await prisma.taxonomy.findFirst({
    where: {
      isApproved: true,
      englishName,
    }
  })

  if (bird?.id) {
    return prisma.list.update({
      where: { id },
      data: { birds: { push: { birdId: bird.id } } }
    })
  } else {
    //create new Taxonomy and add to the list
    const bird = await prisma.taxonomy.create({
      data: {
        englishName,
        isApproved: false,
        taxonomy,
        rank: 'species'
      }
    })
    return prisma.list.update({
      where: { id },
      data: { birds: { push: { birdId: bird.id } } }
    })
  }
}

export const removeBirdById = async (id: string, listId: string) => {

  //remove it from taxonomy if it is not approved;
  const approvedTaxonomy = await prisma.taxonomy.findFirst({
    where: {
      id,
      isApproved: true
    }
  });

  if (!approvedTaxonomy) {
    await prisma.taxonomy.delete({ where: { id } })
  }

  /**
   * @info 
   * Since, $pull in Prisma cannot be found. 
   * 1. get the list of birds and save in temp. find and remove the bird
   * 2. update with the list new with temp
   */
  const temp = await prisma.list.findFirst({
    where: { id: listId },
  })

  const b = temp?.birds.filter(bird => {
    return bird.birdId !== id
  });
  return prisma.list.update({ where: { id: listId }, data: { birds: b } })

}

export async function getListBirdById(listId: string) {
  //@TODO
  // because of bug in aggregateRaw in Prisma
  const mara = await prisma.list.findUnique({ where: { id: listId } })

  return prisma.list.aggregateRaw({
    pipeline:
      [
        {
          '$match': {
            listname: mara?.listname,
            username: mara?.username
          }
        }, {
          '$lookup': {
            'from': 'Taxonomy',
            'localField': 'birds.birdId',
            'foreignField': '_id',
            'as': 'bs'
          }
        }, {
          '$project': {
            listname: 1,
            username: 1,
            "birds": "$bs",
            id: 1
          }
        }
        , {
          '$project': {
            "birds.isApproved": 0,
            "birds.rank": 0,
          }
        }
      ]
  })
}


export const deleteList = async (id: string) => {
  //Search for the birds which are in give list
  const list = await prisma.list.findFirst({ where: { id } })
  const birds = list?.birds;
  // delete all the birds unless the approved
  birds?.forEach(async bird => {
    await prisma.taxonomy.deleteMany({
      where:
        { id: bird.birdId, isApproved: false }
    })
  })
  //delete the list
  return prisma.list.delete({ where: { id } })
}