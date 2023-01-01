import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getLocalAuthorizedUser, isAuthorizedUser } from "utils/user.server";
import { getPaginatedUsers } from "~/models/user.server";
import { useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "utils/session.server";
import { objectIdToString } from "utils/tools.server";
import type { Prisma, Role } from "@prisma/client";
import { ObjectId, ObjectID } from "bson";
type LoaderData = {
  users: [
    {
      _id: string;
      createdAt: { $date: string };
      updatedAt: { $date: string };
      username: string;
      role: Role;
    }
  ];
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalUsers: number;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLocalAuthorizedUser(request);
  //if not logged in
  const isAuthorized = isAuthorizedUser(user?.role || "user");
  if (!user) {
    return redirect("/users/login");
  }

  //force logout
  if (isAuthorized === false) {
    const session = await getSession(request.headers.get("Cookie"));
    if (typeof session === "object") {
      return redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
  }

  const rawData = (await getPaginatedUsers({
    pageNumber: 1,
    limit: 10,
  })) as unknown as Prisma.JsonArray;
  const data = rawData[0] as unknown as LoaderData;
  return json<LoaderData>(data);
};
export default function User() {
  const { users } = useLoaderData<LoaderData>();

  return (
    <article>
      <section>
        {users.map((user) => (
          <p key={user._id}>{user.username}</p>
        ))}
      </section>
    </article>
  );
}
