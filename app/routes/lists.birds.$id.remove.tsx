import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { Link, useSearchParams } from "@remix-run/react"
import invariant from "tiny-invariant"
import { removeBirdById } from "~/models/list.server"

export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id
  invariant(id, "Invalid id")
  const url = new URL(request.url)
  const listId = url.searchParams.get("listId")
  invariant(listId, "Invalid list id")
  await removeBirdById(id, listId)
  return redirect(`/lists/${listId}`)
}

export default function RemoveBird() {
  const [searchParam] = useSearchParams()
  const englishName = searchParam.get("englishName")
  const listname = searchParam.get("listname")
  const listId = searchParam.get("listId")
  return (
    <form method="post" className="message message--warning">
      <p>
        Are you are sure, you want to remove <em>{englishName} </em>
        from your list <em>{listname}</em> ?
      </p>
      <p>
        <button type="submit" className="button button--danger button--small">
          Yes
        </button>{" "}
        <Link to={`/lists/${listId}`}>back</Link>
      </p>
    </form>
  )
}
