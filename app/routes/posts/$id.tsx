import type { Post } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPostById } from "~/models/post.server";

export const loader: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(id, "Invalid post id");
  const post = await getPostById(id);
  invariant(post, "No Post found");
  return json<Post>({ ...post });
};

export default function ArticleById() {
  const { title, body } = useLoaderData<Post>();
  return (
    <article>
      <h3>{title}</h3>
      <p>{body}</p>
      <p>
        <Link to={`remove`}>Remove this post</Link>
      </p>
      <p>
        <Link to={`edit`}>Edit</Link>
      </p>
      <p>
        <Link to={`featured`}>Set featured</Link>
      </p>
    </article>
  );
}
