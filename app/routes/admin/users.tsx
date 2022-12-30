import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { getLocalAuthorizedUser, isAuthorizedUser } from "utils/user.server"
import { getPaginatedUsers } from "~/models/user.server";
import { useLoaderData } from "@remix-run/react";


export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthorizedUser(request);
  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || 'user');
  console.log("isAuthorized", isAuthorized, user?.role)
  if (!user || !isAuthorized) {
    return json({ error: `You are not authorized` }, { status: 409 })
  }

  const users = await getPaginatedUsers({ pageNumber: 1, limit: 3 });
  return json(users)

}
export default function User() {
  const users = useLoaderData();
  console.log(users, 'hahahahahah')
  return (
    <div>{users?.error}</div>
  )
}

