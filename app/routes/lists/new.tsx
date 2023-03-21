import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { getLocalAuthenticatedUserId } from "~/utils/session.server";
import type { ActionFunction } from "@remix-run/node";

import { getUserById } from "~/models/user.server";
import { createList, isTakenListName } from "~/models/list.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request);
  if (!userId) {
    return redirect("/users/login");
  }
  const user = await getUserById(userId);
  const username = user?.username;
  const form = await request.formData();
  const listname = form.get("listname") as string;
  if (!listname || listname === "") {
    return json({ error: `Error: bad input` }, { status: 401 });
  }
  if (!username) {
    return json({ error: `You must be logged in ` }, { status: 400 });
  }
  const isTaken = await isTakenListName({ username, listname });
  if (isTaken) {
    return json(
      { error: `You have already a list with the name ${listname} ` },
      { status: 401 }
    );
  }
  const result = await createList({ username, listname });
  if (result) return redirect("/lists");
  return json({ error: "couldn't create it!" });
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLocalAuthenticatedUserId(request);
  if (!userId) {
    return redirect("/users/login");
  }
  return null;
};
export default function CreateList() {
  const data = useActionData();
  const error = data?.error;
  return (
    <section>
      <Form method="post">
        {error && <p style={{ color: "red" }}> {error}</p>}
        <label htmlFor="listname">List name</label>
        <input id="listname" name="listname" type="text" />
        <button>Create new list</button>
      </Form>
      <Link to="/lists">back</Link>
    </section>
  );
}

export function ErrorBoundary() {
  return (
    <section className="error-container">
      Something unexpected went wrong. Sorry about that.
    </section>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <section className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/users/login">Login</Link>
      </section>
    );
  } else {
    return (
      <section>
        <p>Something went wrong</p>
        <a href="/">Home</a>
      </section>
    );
  }
}
