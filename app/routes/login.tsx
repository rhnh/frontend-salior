import { redirect } from "@remix-run/node"
import { getUser, getUserById } from "~/models/user.server"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import type { SaliorResponse } from "~/utils/types.server"
import invariant from "tiny-invariant"
import userIcon from "~/styles/assets/images/user-square.svg"


import {
  commitSession,
  createUserSession,
  getLocalAuthenticatedUserId,
} from "~/utils/session.server"
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const password: string = (form.get("password") as string) || ""
  const username: string = (form.get("username") as string) || ""
  invariant(username, "Invalid username/password")
  invariant(password, "Invalid username/password")
  const user = await getUser({ password, username })

  if (!user) {
    throw new Response(`You have enter wrong username or password`, {
      status: 409,
    })
  }

  const session = await createUserSession(user.id)

  if (typeof session === "object") {
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }
  throw new Response("Something went wrong", { status: 500 })
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request)
  if (userId) {
    const user = await getUserById(userId)
    if (user?.id) {
      return redirect("/")
    }
  }
  return null
}
export default function Login() {
  const actionData = useActionData<SaliorResponse>()
  const navigation = useNavigation()
  const state = navigation.state ? navigation.state : actionData?.state
  return (
    <article className="users cards content">
      <Form method="post" className="card users-inputs">
        <section className="user-icon users-image">
          <img src={`${userIcon}`} alt="" />
        </section>
        <h3 className="headings">Login</h3>
        <p>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Type your username"
            id="username"
            name="username"
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            placeholder="Type your password"
            type="password"
            id="password"
            name="password"
          />
        </p>

        {actionData?.state === "ERROR" ? (
          <p className="error-message" style={{ color: "red" }}>
            {actionData.message}
          </p>
        ) : null}

        <button
          className="button button--success"
          type="submit"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "logging" : "login"}
        </button>
        <p>
          Not already register ? Click <Link to="/users/register">here</Link>
          {` `} to register!
        </p>
      </Form>
    </article>
  )
}

export function CatchBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <section className="message-error">
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
        <Link to="/login">Try again</Link>
        Click here to <Link to="/users/register">register</Link> a new account.
      </section>
    )
  }
}
