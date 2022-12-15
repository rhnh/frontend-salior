import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { getTaxonomyPaginated } from "~/models/taxonomy.server";
import { Link, useLoaderData } from "@remix-run/react";
import type { Taxonomy } from "@prisma/client";
import { objectIdToString } from "utils/tools";

type TaxonomyAndId = Omit<Taxonomy, "id"> & { _id: { ob: string } };

type LoaderData = {
  birds: TaxonomyAndId[];
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalBirds: number;
};

export const loader: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams.get("page");
  console.log(searchParams);
  const rawData = await getTaxonomyPaginated(1, 5);
  const data = rawData[0];
  return json(data);
};

export default function Birds() {
  const { birds, totalBirds, page } = useLoaderData<LoaderData>();
  console.log(birds);
  return (
    <article>
      <h1>List of all birds</h1>
      There are {totalBirds} birds on this site!
      {birds.map((bird) => (
        <p key={objectIdToString(bird._id)}>{bird.englishName}</p>
      ))}
      <Link to={`/birds?page=1`}>{page}</Link>
    </article>
  );
}
