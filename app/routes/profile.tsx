import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import type { LoaderFunction } from "@remix-run/node"
import { getUserByUsername } from "~/models/user.server"
import userIcon from "~/styles/assets/images/user-square.svg"
import type { LoggedUserLoader } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const localUser = await getLocalAuthenticatedUser(request)

  if (!localUser) {
    return redirect("/login")
  }

  const isAuthorized = isAuthorizedUser(localUser?.role)
  const user = await getUserByUsername(localUser.username)
  return json({ isAuthorized, user })
}

export default function Profile() {
  const { isAuthorized, user } = useLoaderData<LoggedUserLoader>()
  return (
    <article className="cards single-card content">
      <div className="card ">
        <section className="user-icon">
          <img src={`${userIcon}`} alt="" />
        </section>
        <p>
          {user?.username} registered on{" "}
          {/* <p>{user?.createdAt ?? new Date(user?.createdAt).toDateString()}</p> */}
        </p>

        <i
          className={
            user?.role === "admin"
              ? "icon-admin"
              : user?.role === "mod"
                ? "icon-mod"
                : "icon-user"
          }
        ></i>
        {isAuthorized === true ? (
          <>
            <Link to="/admin">Admin Panel</Link>
          </>
        ) : null}
        <Link to="/change-password">Change Password</Link>
      </div>
    </article>
  )
}
