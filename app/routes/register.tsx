
import { Form, Link, isRouteErrorResponse, useRouteError, } from "@remix-run/react"
import { redirect, json } from "@remix-run/node"
import { createUser, isUsernameTaken } from "~/models/user.server"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { getLocalAuthenticatedUser } from "~/utils/user.server"
import invariant from "tiny-invariant"
import userIcon from "~/styles/assets/images/user-square.svg"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const password: string = (form.get("password") as string) || ""
  const username: string = (form.get("username") as string) || ""
  invariant(username, "Invalid username/password")
  invariant(password, "Invalid username/password")
  const isTaken = await isUsernameTaken(username)
  if (isTaken) {
    throw new Response(`Username ${username} has been already taken!`, {
      status: 401,
      statusText: `Please try again with different username`,
    })
  }
  const newUser = await createUser({ username, password })
  if (newUser && newUser.id) {
    return redirect("/")
  }
  return json({
    error: `Something went wrong while registering new user. Please try laster again!`,
  })
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthenticatedUser(request);
  if (user) {
    return redirect("/");
  }
  //if not logged in
  return null
}
export default function Register() {
  return (
    <article className="users cards  content">
      <Form method="post" className="card users-inputs">
        <section className="user-icon users-image">
          <img src={`${userIcon}`} alt="" />
        </section>
        <h3>Register</h3>
        <p>
          <label htmlFor="username">Username</label>
          <input
            className="user-input"
            type="text"
            id="username"
            name="username"
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            className="user-input"
            type="password"
            id="password"
            name="password"
          />
        </p>
        <p>
          <label htmlFor="confirm-password">Confirm our Password</label>
          <input
            className="user-input"
            type="password"
            id="confirm-password"
            name="confirm-password"
          />
        </p>
        <p>
          <button className="button button--success" type="submit">
            Register
          </button>
        </p>
        <p>
          Already a member ? Click <Link to="/login">here</Link>
          to login!
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

