import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { getPaginatedPosts } from "~/models/post.server";
import type { PostWithId, PaginatedPosts } from "~/utils/types.server";
import { Pagination } from "~/components/Pagination";
import invariant from "tiny-invariant";


import type { Post } from "@prisma/client";
import DisplayPosts from "~/components/DisplayPost";
import { fixTheId } from "~/utils/base";

/**
 * @todo ! get params and page numbers
 * @returns returns posts per page
 */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams;
  const page = Number(searchParam.get("page")) || 1;
  const limit = Number(searchParam.get("limit")) || 5;
  const data = await getPaginatedPosts({ pageNumber: page, limit });
  if (!data[0]) {
    return json([]);
  }
  invariant(data, "No posts found");
  const jawData = data[0] as unknown as PaginatedPosts;
  //posts
  const posts = {
    ...jawData,
    posts: jawData?.posts.map((post: PostWithId) => fixTheId(post)),
  } as unknown as Post;

  return json(posts);
};

export default function PostRouter() {
  let { pathname } = useLocation();
  const { posts, totalPages, hasPreviousPage, hasNextPage, page } =
    useLoaderData<PaginatedPosts>();
  const filterPost = posts as unknown as Post[];
  if (posts?.length <= 0 || !posts) {
    return <p>No Post found</p>;
  }
  return (
    <>
      <article className="cards">
        {filterPost.map((post) => (
          <DisplayPosts key={post.id} post={post} isTrim={true} />
        ))}
      </article>

      <section>
        <Pagination
          total={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          rootPath={pathname}
          current={page}
        />
      </section>
    </>
  );
}
