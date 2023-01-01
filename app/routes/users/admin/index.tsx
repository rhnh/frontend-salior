import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { Link } from "react-router-dom";
import { getLocalAuthorizedUser, isAuthorizedUser } from "utils/user.server";
import { useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthorizedUser(request);

  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || "user");
  if (!user) {
    return redirect("/users/login");
  }
  //force logout
  if (isAuthorized === false) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
  }
  return null;
};
export default function Index() {
  const data = useLoaderData();

  return (
    <section>
      <p>
        <Link to="users">Users</Link>
      </p>
      <p>
        <Link to="users">Taxonomies</Link>
      </p>
    </section>
  );
}
