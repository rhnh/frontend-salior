import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Link } from "react-router-dom"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import type { LoaderFunction } from "@remix-run/node"
import { getUserByUsername } from "~/models/user.server"
import userIcon from "~/styles/assets/images/user-square.svg"

export const loader: LoaderFunction = async ({ request }) => {
  const localUser = await getLocalAuthenticatedUser(request)

  if (!localUser) {
    return redirect("/users/login")
  }

  const isAuthorized = isAuthorizedUser(localUser?.role)
  const user = await getUserByUsername(localUser.username)
  return json({ isAuthorized, user })
}

export default function Profile() {
  const { isAuthorized, user } = useLoaderData()
  return (
    <article className="cards centered">
      <div className="card ">
        <section className="user-icon">
          <img src={`${userIcon}`} alt="" />
        </section>
        <p>
          {user.username} registered on{" "}
          <p>{new Date(user.createdAt).toDateString()}</p>
        </p>

        <i
          className={
            user.role === "admin"
              ? "icon-admin"
              : user.role === "mod"
              ? "icon-mod"
              : "icon-user"
          }
        ></i>
        {isAuthorized === true ? (
          <>
            <Link to="/users/admin">Admin Panel</Link>
          </>
        ) : null}
        <Link to="/users/password">Change Password</Link>
      </div>
    </article>
  )
}
