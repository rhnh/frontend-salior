import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getTaxonomyPaginated } from "~/models/taxonomy.server";
import { useLoaderData, useLocation } from "@remix-run/react";

import { DisplayBirds } from "~/components/DisplayBirds";

import type { PaginatedBirds } from "~/utils/types.server";
import { getLocalAuthenticatedUser } from "~/utils/user.server";
import { Pagination } from "~/components/Pagination";

interface BirdsData extends PaginatedBirds {
  isAuthorized: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams;
  const page = Number(searchParam.get("page")) || 1;
  const limit = Number(searchParam.get("limit")) || 5;
  const rawData = await getTaxonomyPaginated(page, limit);

  const data = rawData[0] as unknown as PaginatedBirds;
  const authorizedUser = await getLocalAuthenticatedUser(request);
  const isAuthorized = authorizedUser?.role !== "user";

  const birds: BirdsData = { ...data, isAuthorized };
  return json(birds);
};

export default function Birds() {
  const { page, birds, totalBirds, hasNextPage, hasPreviousPage, totalPages } =
    useLoaderData<BirdsData>();
  let { pathname } = useLocation();

  if (birds?.length <= 0 || birds === undefined) return <p>No Birds found</p>;
  return (
    <article>
      <h1>List of all birds</h1>
      There are {totalBirds} birds on this site!
      <section>Search</section>
      <section>
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
      </section>
      <section>
        <Pagination
          total={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          rootPath={pathname}
          current={page}
        />
      </section>
    </article>
  );
}
