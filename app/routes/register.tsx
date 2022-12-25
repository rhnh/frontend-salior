import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { createUser, isUsernameTaken } from "~/models/user.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: LoaderFunction = async ({ request }) => {
  const form = await request.formData();
  const password: string = (form.get("password") as string) || "";
  const username: string = (form.get("username") as string) || "";
  const isTaken = await isUsernameTaken(username);
  if (isTaken) {
    return json({
      error: `Username ${username} already taken. Please retry with other username`,
    });
  }
  const newUser = await createUser({ username, password });
  if (newUser && newUser.id) {
    return redirect("/");
  }
  return json({
    error: `Something went wrong while registering new user. Please try laster again!`,
  });
};

const Register = () => {
  return (
    <article className="content">
      <article className="card">
        <section className="vh-centered">
          <form method="post">
            <p>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" />
            </p>
            <p>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />
            </p>
            <p>
              <label htmlFor="confirm-password">Confirm Your Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
              />
            </p>
            <p>
              <button type="submit">Register</button>
            </p>
          </form>
        </section>
        <section>
          <Link to="register">Register</Link>
        </section>
      </article>
    </article>
  );
};

export default Register;
