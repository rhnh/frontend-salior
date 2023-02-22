import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { getUser, getUserById } from "~/models/user.server";
import type { ActionFunction } from "@remix-run/node";
import {
  commitSession,
  createUserSession,
  getLocalAuthenticatedUserId,
} from "~/utils/session.server";
import {
  Form,
  Link,
  useActionData,
  useCatch,
  useTransition,
} from "@remix-run/react";
import type { SaliorResponse } from "~/utils/types.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const password: string = (form.get("password") as string) || "";
  const username: string = (form.get("username") as string) || "";
  const user = await getUser({ password, username });

  if (!user) {
    throw new Response(`You have enter wrong username or password`, {
      status: 409,
    });
  }

  const session = await createUserSession(user.id);

  if (typeof session === "object") {
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  throw new Response("Something went wrong", { status: 500 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request);
  if (userId) {
    const user = await getUserById(userId);
    if (user?.id) {
      return redirect("/");
    }
  }
  return null;
};
export default function Login() {
  const actionData = useActionData<SaliorResponse>();
  const transition = useTransition();
  const state = transition.state ? transition.state : actionData?.state;
  return (
    <article className="content">
      <section>
        <h3>Login</h3>
        <Form method="post">
          <p>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </p>
          {actionData?.state === "ERROR" ? (
            <p className="error-message" style={{ color: "red" }}>
              {actionData.message}
            </p>
          ) : null}
          <p>
            <button type="submit" disabled={state === "submitting"}>
              {state === "submitting" ? "logging" : "login"}
            </button>
          </p>
        </Form>
      </section>
    </article>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 409) {
    return (
      <section className="error-container">
        <p>{caught.data}</p>
        <Link to="/users/login">Try again</Link>
        Click here to <Link to="/users/register">register</Link> a new account.
      </section>
    );
  } else if (caught.status == 500) {
    return (
      <section>
        <p>Something went wrong</p>
        <Link to="/users/login">Try again</Link>
      </section>
    );
  }
}
