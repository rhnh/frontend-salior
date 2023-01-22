import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPostById, setFeaturedPost } from "~/models/post.server";
import { redirect, json } from "@remix-run/node";
import type { Post } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { getLocalAuthenticatedUser } from "~/utils/user.server";
import { getLocalAuthenticatedUserId } from "~/utils/session.server";

export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id;
  invariant(id, "Invalid id");
  const post: Post = (await getPostById(id)) as Post;
  invariant(post, "Post not found");
  const user = await getLocalAuthenticatedUser(request);
  if (!user) {
    return redirect("/users/login");
  }
  if (
    user.role === "admin" ||
    user.role === "contributor" ||
    user.role === "mod"
  ) {
    setFeaturedPost({ isFeatured: true, id });
    return redirect("/posts");
  }
  return null;
};

export const loader: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(id, "Invalid id");

  const post = await getPostById(id);
  invariant(post, "Post not found");

  const isAuthorizedUser = await getLocalAuthenticatedUser(request);
  if (
    (isAuthorizedUser && isAuthorizedUser.role === "admin") ||
    isAuthorizedUser?.role === "contributor" ||
    isAuthorizedUser?.role === "mod"
  ) {
    return json<Post>({ ...post });
  }
  return null;
};
export default function FeaturedPostById() {
  const post = useLoaderData<Post>();
  if (!post) {
    return <p>You are not authorized</p>;
  }
  const { title, body, isFeatured } = post;
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
