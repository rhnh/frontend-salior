import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Link } from "react-router-dom"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthenticatedUser(request)
  if (!user) {
    return redirect("/users/login")
  }
  const isAuthorized = isAuthorizedUser(user?.role)

  return json({ isAuthorized })
}

export default function Profile() {
  const { isAuthorized } = useLoaderData()
  return (
    <article className="layout">
      <section>
        {isAuthorized === true ? (
          <>
            <Link to="/users/admin">Admin Panel</Link>
          </>
        ) : null}
      </section>
      <section>
        <Link to="/users/password">Change Password</Link>
      </section>
    </article>
  )
}
