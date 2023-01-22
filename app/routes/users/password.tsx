import { json, LoaderFunction, redirect } from "@remix-run/node";
import {
  destroySession,
  getSession,
  getLocalAuthenticatedUserId,
} from "~/utils/session.server";
import { getLocalAuthenticatedUser } from "~/utils/user.server";
import type { ActionFunction } from "@remix-run/node";
import { changePassword } from "~/models/user.server";
import invariant from "tiny-invariant";
import { Link, useActionData, useCatch } from "@remix-run/react";
export const loader: LoaderFunction = async ({ request, context }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
  }
  return null;
};
export const action: ActionFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
  }
  const form = await request.formData();
  const currentPassword = form.get("current-password") as unknown as string;
  const newPassword = form.get("new-password") as unknown as string;
  const userId = await getLocalAuthenticatedUserId(request);
  invariant(currentPassword, "no current password");
  invariant(userId, "Invalid userId");
  invariant(newPassword, "no new password");
  const result = await changePassword({
    id: userId,
    currentPassword,
    newPassword,
  });

  if (result) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return json(
        { result: "You have successfully changed your password" },
        {
          status: 201,
        }
      );
    }
  } else throw new Response("Please try again!", { status: 404 });
};
export default function Password() {
  const data = useActionData<typeof action>();
  if (data) {
    return (
      <section>
        <p>{data?.result}</p>
        <p>
          Click <Link to="/users/login">here</Link> to login!
        </p>
      </section>
    );
  }
  return (
    <section>
      <h3>Change your Password</h3>
      <form method="post">
        <p>
          <label htmlFor="current-password">Current Password</label>
          <input name="current-password" id="current-password" />
        </p>
        <p>
          <label htmlFor="new-password">New Password</label>
          <input name="new-password" id="new-password" />
        </p>
        <p>
          <label htmlFor="confirm-password">Confirm new Password</label>
          <input name="confirm-password" id="confirm-password" />
        </p>
        <button type="submit">Change Password</button>
      </form>
    </section>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  switch (caught.status) {
    case 404: {
      return (
        <section>
          <Link to="/users/password">{caught.data}</Link>
        </section>
      );
    }
    case 201: {
      return <p>Please re login</p>;
    }
    default: {
      // if we don't handle this then all bets are off. Just throw an error
      // and let the nearest ErrorBoundary handle this
      throw new Error(`${caught.status} not handled`);
    }
  }
}

// this will handle unexpected errors (like the default case above where the
// CatchBoundary gets a response it's not prepared to handle).
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <section>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </section>
  );
}
