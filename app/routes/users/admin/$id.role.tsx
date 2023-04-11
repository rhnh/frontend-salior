import { redirect } from "@remix-run/node"
import { destroySession, getSession } from "~/utils/session.server"
import type { ActionFunction } from "@remix-run/node"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getUserById, setRole } from "~/models/user.server"
import invariant from "tiny-invariant"
import type { Role } from "@prisma/client"

export const loader: LoaderFunction = async ({ request, params }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request)
  //if not logged in
  const isAuthorized = isAuthorizedUser(authorizedUser?.role || "user")
  if (!authorizedUser) {
    const session = await getSession(request.headers.get("Cookie"))
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    }
  }
  //force logout
  if (isAuthorized === false) {
    const session = await getSession(request.headers.get("Cookie"))
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    }
  }

  const id = params?.id
  if (!id) {
    throw new Response(`Invalid`, { status: 404 })
  }
  const user = await getUserById(id)
  return json({ user })
}
export const action: ActionFunction = async ({ request, params }) => {
  // check the user id
  const authorizedUser = await getLocalAuthenticatedUser(request)
  //if not logged in
  const isAuthorized = isAuthorizedUser(authorizedUser?.role || "user")
  if (!authorizedUser) {
    const session = await getSession(request.headers.get("Cookie"))
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    }
  }
  //force logout
  if (isAuthorized === false) {
    const session = await getSession(request.headers.get("Cookie"))
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    }
  }
  const form = await request.formData()
  const id = params.id
  const role = form.get("role") as unknown as Role
  invariant(id, "invalid id")
  invariant(role, "Invalid role")
  await setRole({ role, id })
  return redirect("/users/admin/users")
}
export default function ChangeRole() {
  const { user } = useLoaderData()
  return (
    <article>
      <form method="post">
        <section>
          <p>{user.username}</p>
          <p>
            Current Role: <em> {user.role}</em>
          </p>
        </section>
        <select name="role" id="role">
          <optgroup label="Select a Role">
            <option value="user">User</option>
            <option value="contributor">Contributor</option>
            <option value="mod">Moderator</option>
            <option value="admin">Administrator</option>
          </optgroup>
        </select>
        <button type="submit">Change the role </button>
      </form>
    </article>
  )
}
