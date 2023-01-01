import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { getLocalAuthorizedUser, isAuthorizedUser } from "utils/user.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthorizedUser(request);
  if (!user) {
    return redirect("/users/login");
  }
  const isAuthorized = isAuthorizedUser(user?.role);

  return json({ isAuthorized });
};

export default function Profile() {
  const { isAuthorized, users } = useLoaderData();
  console.log(users);
  return (
    <article>
      <section>
        {isAuthorized === true ? <Link to="/users/admin">admin</Link> : null}
      </section>
    </article>
  );
}
