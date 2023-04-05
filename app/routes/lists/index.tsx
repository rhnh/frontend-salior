import { json, redirect } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { getLists } from "~/models/list.server"
import { Link, useLoaderData } from "@remix-run/react"
import type { List } from "@prisma/client"
import { getLocalAuthenticatedUserId } from "~/utils/session.server"
import { getUserById } from "~/models/user.server"

type LoaderData = {
  lists: Pick<List, "id" | "listname" | "username">[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request)
  if (!userId) {
    return redirect("/users/login")
  }
  const user = await getUserById(userId)
  const username = user?.username
  if (!username) {
    return redirect("/users/login")
  }
  const lists = await getLists(username)
  if (lists?.length <= 0) {
    return json([])
  }
  return json({ lists })
}
function ListsIndex() {
  const { lists } = useLoaderData<LoaderData>()
  if (lists?.length <= 0) {
    return <p>No list found </p>
  }
  return (
    <article>
      <ol className="list">
        {!lists ? <p>You don't have any list yet!</p> : null}
        {lists?.map((list) => (
          <li key={list.id}>
            <Link to={list.id}>{list.listname}</Link>
          </li>
        ))}
      </ol>
      <article>
        <Link
          to="/lists/new"
          className="button button--secondary button--small"
        >
          Create new
        </Link>
      </article>
    </article>
  )
}

export default ListsIndex
