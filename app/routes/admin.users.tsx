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
      return redirect("/login", {
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
      return redirect("/login", {
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
  // !todo: add search bar

  return (
    <article className="all-users  content">
      <h3>All Users</h3>
      {users.map((user) => (
        <Fragment key={user._id.$oid}>
          <article>
            <hr></hr>
            <p>
              Name: <em> {user.username}</em>
            </p>

            <p>
              Role:
              <em> {user.role}</em>
            </p>
            <p>
              Registered since:
              <em> {user.createdAt.$date}</em>
            </p>
          </article>
          <Link to={`/admin/${user._id.$oid}/role`}>
            {" "}
            <i className="icon-edit">Change Role</i>{" "}
          </Link>
          <Link to={`/admin/${user._id.$oid}/remove`}>
            <i className="icon-trash">Delete</i>
          </Link>
        </Fragment>
      ))}
    </article>
  )
}
