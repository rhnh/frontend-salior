import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPosts } from "~/models/post.server";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { getRandomTaxonomy } from "~/models/taxonomy.server";
import type { Taxonomy } from "@prisma/client";
import type { PaginatedPosts } from "utils/types.server";
import { Fragment } from "react";

interface LoaderData {
  bird: Taxonomy;
  featuredPosts: PaginatedPosts;
}
export const loader: LoaderFunction = async ({ request }) => {
  const [randomBird] = await getRandomTaxonomy();
  const featuredPosts = await getPosts({
    pageNumber: 1,
    limit: 3,
    isFeatured: true,
  });
  invariant(featuredPosts, "Invalid post");

  return json<LoaderData>({
    featuredPosts: featuredPosts[0] as unknown as PaginatedPosts,
    bird: randomBird,
  });
};

export default function HomeRouter() {
  const { featuredPosts, bird } = useLoaderData<LoaderData>();
  return (
    <article>
      <section>{bird.englishName}</section>
      <section>
        {featuredPosts.posts.length > 0 ? (
          <section>
            <h2>Featured Post</h2>
            {featuredPosts.posts.map((post) => (
              <Fragment key={post._id.$oid}>
                <p>{post.title}</p>
                <p>{post.body}</p>
              </Fragment>
            ))}
          </section>
        ) : null}
      </section>
    </article>
  );
}
