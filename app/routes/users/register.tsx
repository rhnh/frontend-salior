import { Form, Link, useCatch } from "@remix-run/react"
import { redirect } from "@remix-run/node"
import { createUser, isUsernameTaken } from "~/models/user.server"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import invariant from "tiny-invariant"
import userIcon from "~/styles/assets/images/user-square.svg"
export const action: LoaderFunction = async ({ request }) => {
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

export default function Register() {
  return (
    <article className="users cards">
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
          Already a member ? Click <Link to="/users/login">here</Link>
          to login!
        </p>
      </Form>
    </article>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <section className="error-container">
        <p>{caught.data}</p>
        <Link to="/users/register">Try again</Link>
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
