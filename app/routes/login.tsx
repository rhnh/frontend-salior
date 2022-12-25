import { LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getUser, getUserById } from "~/models/user.server";
import type { ActionFunction } from "@remix-run/node";
import {
  commitSession,
  createUserSession,
  getLoggedUserId,
} from "utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const password: string = (form.get("password") as string) || "";
  const username: string = (form.get("username") as string) || "";
  const newUser = await getUser({ password, username });
  if (!newUser) {
    return json(
      {
        error: `Incorrect Username/Password!`,
      },
      { status: 409 }
    );
  }

  const session = await createUserSession(newUser.id);
  if (typeof session === "object")
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });

  return json({ error: `Something went wrong while login` }, { status: 409 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLoggedUserId(request);
  if (userId) {
    const user = await getUserById(userId);
    if (user?.id) {
      return redirect("/");
    }
  }
  return null;
};

const Login = () => {
  return (
    <article className="content">
      <section className="vh-centered">
        <h3>Login</h3>
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
            <button type="submit">Login</button>
          </p>
        </form>
      </section>
    </article>
  );
};

export default Login;
