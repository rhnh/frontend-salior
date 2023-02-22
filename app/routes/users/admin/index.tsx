import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { Link } from "react-router-dom";
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server";
import { destroySession, getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthenticatedUser(request);

  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || "user");
  if (!user) {
    return redirect("/users/login");
  }
  //force logout
  if (isAuthorized === false) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return redirect("/users/login", {
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
    <section>
      <p>
        <Link to="users">Users</Link>
      </p>
      <p>
        <Link to="/taxonomy/verify">Taxonomies</Link>
      </p>
    </section>
  );
}
