import { json, redirect } from "@remix-run/node"
import { Form, Link, isRouteErrorResponse, useActionData, useNavigation, useRouteError } from "@remix-run/react"
import { getLocalAuthenticatedUserId } from "~/utils/session.server"
import type { LoaderFunction, ActionFunction } from "@remix-run/node"

import { getUserById } from "~/models/user.server"
import { createList, isTakenListName } from "~/models/list.server"
type ActionType = {
  error?: Error,
}
export const action: ActionFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request)
  if (!userId) {
    return redirect("/login")
  }
  const user = await getUserById(userId)
  const username = user?.username
  const form = await request.formData()
  const listname = form.get("listname") as string
  if (!listname || listname === "") {
    return json({ error: `Error: bad input` }, { status: 401 })
  }
  if (!username) {
    return json({ error: `You must be logged in ` }, { status: 400 })
  }
  const isTaken = await isTakenListName({ username, listname })
  if (isTaken) {
    return json(
      { error: `You have already a list with the name ${listname} ` },
      { status: 401 }
    )
  }
  const result = await createList({ username, listname })
  if (result) return redirect("/lists")
  return json({ error: "couldn't create it!" })
}

//loader
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request)
  if (!userId) {
    return redirect("/login")
  }
  return null
}
export default function CreateList() {
  const actionData = useActionData<ActionType>()
  const error = actionData?.error
  return (
    <section className="cards single-card">
      <Link to="/lists">
        <i className="icon-first">...back</i>
      </Link>

      <Form method="post" className="card">
        {error && <p style={{ color: "red" }}> {error?.message}</p>}
        <h3>Type Your new List Name</h3>
        <label htmlFor="listname">List Name</label>
        <input
          id="listname"
          name="listname"
          type="text"
          placeholder="Djuma/Mara"
        />
        <button className="button button--success">Create new list</button>
      </Form>
    </section>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error)
  return (
    <section className="error-container">
      Something unexpected went wrong. Sorry about that.

    </section>
  )
}

export function CatchBoundary() {
  const error = useNavigation()

  if (isRouteErrorResponse(error)) {
    return (
      <section className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </section>
    )
  } else {
    return (
      <section>
        <p>Something went wrong</p>
        <a href="/">Home</a>
      </section>
    )
  }
}
