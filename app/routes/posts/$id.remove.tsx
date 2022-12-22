import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deletePostById, getPostById } from "~/models/post.server";
import { Link, useLoaderData } from "@remix-run/react";
import type { Post } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";

export const loader: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid post id");
  const post = await getPostById(id);
  invariant(post, "No Post found");
  return json<Post>({ ...post });
};

export const action: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid id");
  await deletePostById(id);
  return redirect("../");
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
