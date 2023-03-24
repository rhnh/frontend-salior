import { json, redirect } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import { getPaginatedUsers } from "~/models/user.server"
import { Link, useLoaderData } from "@remix-run/react"
import { destroySession, getSession } from "~/utils/session.server"
import type { Prisma, Role } from "@prisma/client"
import { Fragment } from "react"
type LoaderData = {
  users: [
    {
      _id: { $oid: string }
      createdAt: { $date: string }
      updatedAt: { $date: string }
      username: string
      role: Role
    }
  ]
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
  totalUsers: number
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthenticatedUser(request)
  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || "user")
  if (!user) {
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

  const rawData = (await getPaginatedUsers({
    pageNumber: 1,
    limit: 10,
  })) as unknown as Prisma.JsonArray
  const data = rawData[0] as unknown as LoaderData
  return json<LoaderData>(data)
}
export default function User() {
  const { users } = useLoaderData<LoaderData>()
  //todo needs better layout
  return (
    <article>
      {users.map((user) => (
        <Fragment key={user._id.$oid}>
          <section>
            <p>
              User:
              {user.username}
            </p>
            <p>Role: {user.role}</p>
            <p>Registered since: {user.createdAt.$date}</p>
          </section>
          <p>
            <Link
              to={`/users/admin/${user._id.$oid}/role`}
              className="button button--success button--small"
            >
              <i className="icon-edit"> Change Role</i>
            </Link>
          </p>
          <p>
            <Link
              to={`/users/admin/${user._id}/remove`}
              className="button button--danger button--small"
            >
              <i className="icon-trash">Delete</i>
            </Link>
          </p>
          <hr></hr>
        </Fragment>
      ))}
    </article>
  )
}
