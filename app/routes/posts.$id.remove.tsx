import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deletePostById, getPostById } from "~/models/post.server";
import { Link, useLoaderData } from "@remix-run/react";
import type { Post } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { getLocalAuthenticatedUser } from "~/utils/user.server";

export const loader: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid post id");
  const post = await getPostById(id);
  invariant(post, "No Post found");
  return json<Post>({ ...post });
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(id, "Invalid id");
  const user = await getLocalAuthenticatedUser(request);
  if (!user) {
    return redirect("/login");
  }
  if (
    user.role === "admin" ||
    user.role === "contributor" ||
    user.role === "mod"
  )
    await deletePostById(id);
  return redirect("/lists");
};
export default function RemoveListById() {
  const { title } = useLoaderData<Post>();
  return (
    <article>
      <form method="post">
        Are you sure, you want to delete the article "{title}" ?{" "}
        <button type="submit">Yes</button>
        <Link to="..">Back</Link>
      </form>
    </article>
  );
}
