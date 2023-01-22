import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getTaxonomyPaginated } from "~/models/taxonomy.server";
import { useLoaderData } from "@remix-run/react";

import { Pagination } from "~/components/Pagination";
import { DisplayBirds } from "~/components/DisplayBirds";

import type { PaginatedBirds } from "~/utils/types.server";
import { getLocalAuthenticatedUser } from "~/utils/user.server";

interface BirdsData extends PaginatedBirds {
  isAuthorized: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams;
  const page = Number(searchParam.get("page")) || 1;
  const rawData = await getTaxonomyPaginated(page, 5);
  const data = rawData[0] as unknown as PaginatedBirds;

  const authorizedUser = await getLocalAuthenticatedUser(request);
  const isAuthorized = authorizedUser?.role !== "user";

  const birds: BirdsData = { ...data, isAuthorized };
  return json(birds);
};

export default function Birds() {
  const { birds, totalBirds, hasNextPage, hasPreviousPage, totalPages } =
    useLoaderData<BirdsData>();

  if (birds?.length <= 0 || birds === undefined) return <p>No Birds found</p>;
  return (
    <article>
      <h1>List of all birds</h1>
      There are {totalBirds} birds on this site!
      {birds?.map((bird, i) => (
        <DisplayBirds
          key={i}
          englishName={bird.englishName}
          taxonomy={bird.taxonomy}
          rank={bird.rank}
          id={bird._id.$oid}
          image={bird.image}
          isAuthorized={false}
        />
      ))}
      <Pagination
        rootPath="/birds"
        total={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </article>
  );
}
