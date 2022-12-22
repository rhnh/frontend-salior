import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getTaxonomyPaginated } from "~/models/taxonomy.server";
import { useLoaderData } from "@remix-run/react";

import { Pagination } from "~/components/Pagination";
import { DisplayBird } from "~/components/DisplayBird";

import { objectIdToString } from "utils/tools.server";
import type { PaginatedBirds } from "utils/types.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams;
  const page = Number(searchParam.get("page")) || 1;
  const rawData = await getTaxonomyPaginated(page, 5);
  const data = rawData[0];
  return json(data);
};

export default function Birds() {
  const { birds, totalBirds, hasNextPage, hasPreviousPage, totalPages } =
    useLoaderData<PaginatedBirds>();
  return (
    <article>
      <h1>List of all birds</h1>
      There are {totalBirds} birds on this site!
      {birds.map((bird, i) => (
        <DisplayBird
          key={i}
          englishName={bird.englishName}
          taxonomy={bird.taxonomy}
          rank={bird.rank}
          id={objectIdToString(bird._id)}
          image={bird.image}
        />
      ))}
      <Pagination
        rootPath="/birds"
        total={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      ></Pagination>
    </article>
  );
}
