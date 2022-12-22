import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPostById, setFeaturedPost } from "~/models/post.server";
import { redirect, json } from "@remix-run/node";
import type { Post } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

export const action: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid id");
  const post: Post = (await getPostById(id)) as Post;
  invariant(post, "Post not found");
  setFeaturedPost({ isFeatured: true, id });
  return redirect("/posts");
};

export const loader: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid id");

  const post = await getPostById(id);
  invariant(post, "Post not found");

  return json<Post>({ ...post });
};
export default function FeaturedPostById() {
  const { title, body, isFeatured } = useLoaderData<Post>();
  return (
    <article>
      <form method="post">
        <h3>Set Featured</h3>
        {title}
        <p>{body}</p>
        {isFeatured === true ?? <p>This post is featured</p>}
        <button type="submit">Save</button>
      </form>
    </article>
  );
}
