import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server";
import { getTaxonomyById } from "~/models/taxonomy.server";
import type { LoaderFunction } from "@remix-run/node";
import type { Bird } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { TaxonomyAndId } from "~/utils/types.server";
import { Link } from "react-router-dom";

interface LoaderData extends Partial<TaxonomyAndId> {
  isAuthorized: boolean;
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(id, "No Invalid id");
  const data = await getTaxonomyById(id);

  //authorization
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) return redirect("/users/login");
  const isAuthorized = isAuthorizedUser(authorizedUser?.role);
  if (data) {
    const bird = data as unknown as Bird;
    return json<LoaderData>({ ...bird, isAuthorized });
  }
  return null;
};

export default function BirdById() {
  const data = useLoaderData<LoaderData>();
  const { isAuthorized, englishName, id } = data;
  return (
    <article>
      <section>
        {isAuthorized === true ? (
          <>
            <p>
              <Link to={`/taxonomy/${id}/edit`}>Edit</Link>
            </p>
            <p>
              <Link to={`/taxonomy/${id}/remove`}>Delete</Link>
            </p>
          </>
        ) : null}
      </section>
      <section>
        <dl>
          <dt>Name: </dt>
          <dd>{englishName}</dd>
        </dl>
      </section>
    </article>
  );
}
