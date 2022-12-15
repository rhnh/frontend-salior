import { PrismaClient } from "@prisma/client";
import type { Taxonomy } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.resolve(
    africanFishEagle().map(async (eagle) => {
      return await db.taxonomy.create({
        data: eagle as Taxonomy,
      });
    })
  );
  await db.list.create({
    data: {
      username: "john",
      listname: "mara",
    },
  });
}

const africanFishEagle = (): Partial<Taxonomy>[] => [
  {
    taxonomy: "Haliaeetus vocifer",
    englishName: "African Fish eagle",
    isApproved: true,
    rank: "species",
    info: `The African fish eagle (Haliaeetus vocifer) or the African sea eagle, is a large species of eagle found throughout sub-Saharan Africa wherever large bodies of open water with an abundant food supply occur. It is the national bird of Malawi, Namibia, Zambia, and Zimbabwe. As a result of its large range, it is known in many languages. Examples of names include:  `,
    username: "john",
    credit: "john",
    parent: "Haliaeetus",
    slug: "african-fish-eagle",
    ancestors: [
      "Haliaeetus",
      "Haliaeetinae",
      "Accipitridae",
      "Accipitriformes",
    ],
  },
  {
    taxonomy: "Haliaeetus",
    englishName: "See eagle",
    isApproved: true,
    rank: "genus",
    username: "john",
    credit: "john",
    parent: "Haliaeetinae",
    ancestors: ["Haliaeetinae", "Accipitridae", "Accipitriformes"],
  },
  {
    taxonomy: "Haliaeetinae",
    isApproved: true,
    rank: "family",
    username: "john",
    parent: "Accipitridae",
    ancestors: ["Accipitridae", "Accipitriformes"],
  },
  {
    taxonomy: "Accipitridae",
    isApproved: true,
    rank: "family",
    info: "The Accipitridae is one of the three families within the order Accipitriformes, and is a family of small to large birds with strongly hooked bills and variable morphology based on diet.",
    username: "john",
    parent: "Accipitriformes",
    ancestors: ["Accipitriformes"],
  },
  {
    taxonomy: "Accipitriformes",
    isApproved: true,
    rank: "order",
    username: "john",
    info: "",
    ancestors: [],
  },
];

seed().then(() => console.log("done"));
