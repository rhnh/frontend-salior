import type { Post, Role } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getLocalAuthorizedUser } from "utils/user.server";
import { getPostById } from "~/models/post.server";

type LoaderData = {
  title: string;
  body: string;
  isOwner: boolean;
  role: Role;
};
export const loader: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(id, "Invalid post id");
  const user = await getLocalAuthorizedUser(request);
  if (!user) return redirect("/login");
  const owner = user.username;
  const role = user.role;
  const post = await getPostById(id);
  invariant(post, "No Post found");
  const isOwner = post.username === owner;
  return json<LoaderData>({ ...post, isOwner, role });
};

export default function ArticleById() {
  const { title, body, isOwner, role } = useLoaderData<LoaderData>();
  const isAuthorized = role === "admin" || role === "mod";
  console.log(isAuthorized, "isAuthorized", isOwner);
  return (
    <article>
      <h3>{title}</h3>
      <p>{body}</p>
      <p>
        {(isOwner || isAuthorized === true) && (
          <Link to={`remove`}>Remove this post</Link>
        )}
      </p>
      <p>
        {(isOwner || isAuthorized === true) && <Link to={`edit`}>Edit</Link>}
      </p>
      <p>
        {isAuthorized === true ? (
          <Link to={`featured`}>Set featured</Link>
        ) : null}
      </p>
    </article>
  );
}
