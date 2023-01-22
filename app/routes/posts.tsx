import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { getLocalAuthenticatedUser, isAuthorizedUser } from "utils/user.server";
export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) {
    return redirect("/users/login");
  }
  const isAuthorized = isAuthorizedUser(authorizedUser?.role);
  return json({ isAuthorized });
};
export default function Posts() {
  const { isAuthorized } = useLoaderData();
  return (
    <article>
      {isAuthorized === true ? <Link to="new">Write a new article</Link> : null}
      <Outlet />
    </article>
  );
}
