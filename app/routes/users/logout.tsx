import { redirect } from "@remix-run/node"
import { destroySession, getSession } from "~/utils/session.server"
import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"))
  if (typeof session === "object" || session !== undefined)
    return redirect("/users/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    })
  return null
}
