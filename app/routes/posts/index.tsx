import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import type { PostWithId } from "~/utils/types.server";

/**
 * @todo ! get params and page numbers
 * @returns returns posts per page
 */
export const loader: LoaderFunction = async () => {
  const posts = await getPosts({ pageNumber: 1, limit: 3 });
  if (!posts[0]) {
    return json([]);
  }
  return json(posts[0]);
};

type LoaderData = {
  posts: PostWithId[];
  page: number;
  totalPages: number;
  totalPosts: number;
  hasPreviousPage: boolean;
  hastNextPage: boolean;
};

export default function PostRouter() {
  const { posts } = useLoaderData<LoaderData>();
  if (posts?.length <= 0 || !posts) {
    return <p>No Post found</p>;
  }
  return (
    <article>
      {posts.map((post) => (
        <section key={post._id.$oid}>
          <Link to={`${post._id.$oid}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>{post.body}</p>
        </section>
      ))}
    </article>
  );
}
