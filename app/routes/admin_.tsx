import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server";
import { destroySession, getSession } from "~/utils/session.server";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthenticatedUser(request);

  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || "user");
  if (!user) {
    return redirect("/login");
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
  return (
    <section className="content">
      <p>
        <Link to="/admin/users">Users</Link>
      </p>
      <p>
        <Link to="/taxonomy/verify">Taxonomies</Link>
      </p>
    </section>
  );
}
