// import { json, redirect } from "@remix-run/node";
// import { Link, Outlet, useLoaderData } from "@remix-run/react";
// import type { LoaderFunction } from "@remix-run/node";
// import { getLocalAuthenticatedUser, isAuthorizedUser } from "utils/user.server";
/**
 *
 * @param param0
 * @returns
 */
/*
export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) {
    return redirect("/users/login");
  }
  const isAuthorized = isAuthorizedUser(authorizedUser?.role);
  return json({ isAuthorized });
};
*/

import { Outlet } from "@remix-run/react";

export default function Posts() {
  // const { isAuthorized } = useLoaderData();
  return (
    <>
      {/* {isAuthorized === true ? <Link to="new">Write a new article</Link> : null} */}
      <Outlet />
    </>
  );
}
