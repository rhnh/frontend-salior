import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPosts } from "~/models/post.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { PaginatedPosts } from "utils/types.server";
import { objectIdToString } from "utils/tools.server";

export const action: ActionFunction = async ({ request }) => {
  console.log(request.headers);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const featuredPosts = await getPosts({
    pageNumber: 1,
    limit: 3,
    isFeatured: true,
  });
  invariant(featuredPosts, "Invalid post");
  console.log(request.headers);
  const header = new Headers();
  header.set("Content-Type", "application/json");
  header.set("Authorization", `Bearer abc`);
  if (!featuredPosts[0]) return json([]);
  return json(featuredPosts[0]);
};

export default function HomeRouter() {
  const data = useLoaderData<PaginatedPosts>();
  if (!data || !data.posts) {
    return <p>No post found!</p>;
  }
  return (
    <section>
      <h2>Featured Post</h2>
      {data?.posts.map((post) => (
        <p key={objectIdToString(post._id)}>{post.title}</p>
      ))}
    </section>
  );
}
