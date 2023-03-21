import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "react-router-dom"
import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { deleteList } from "~/models/list.server"
import { getLocalAuthenticatedUser } from "~/utils/user.server"

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url)
  const id = params.id
  const listname = url.searchParams.get("listname")
  return json({ listname, id })
}

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id
  invariant(id, "Invalid id")
  const authorizedUser = await getLocalAuthenticatedUser(request)
  if (!authorizedUser) {
    return redirect("/users/login")
  }
  await deleteList(id)
  return redirect("/lists")
}

export default function RemoveList() {
  const { listname, id } = useLoaderData<typeof loader>()
  return (
    <article className="message--success">
      <form method="post">
        <h1>
          Are you are sure you want to the entire list
          <Link to={`/lists/${id}`}>{listname}</Link>
        </h1>
        <p>
          <button type="submit">Yes</button>
        </p>
        <Link to={`/lists/${id}`}>back</Link>
      </form>
    </article>
  )
}
