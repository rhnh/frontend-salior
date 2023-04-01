import type { LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getFeaturedPost } from "~/models/post.server"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import Posts from "~/components/Posts"
import type { Post, Taxonomy } from "@prisma/client"
import { getRandomTaxonomy } from "~/models/taxonomy.server"
import React, { Fragment } from "react"
import { fixTheId } from "tests/utils"
import type { TaxonomyAndId } from "utils/types.server"

interface Loader {
  bird: Taxonomy
  posts: Post[]
}
export const loader: LoaderFunction = async () => {
  const posts = (await getFeaturedPost()) as unknown as Post[]
  invariant(posts, "No post found")
  const data = (await getRandomTaxonomy()) as unknown as TaxonomyAndId[]
  invariant(data, "invalid data")
  console.log(data[0])
  invariant(data, "No bird found")
  const bird = {
    ...data[0],
    ...fixTheId({ _id: data[0]._id }),
  } as unknown as Taxonomy
  console.log(bird)
  return json<Loader>({ posts, bird })
}

export default function HomeRouter() {
  const { posts: data, bird } = useLoaderData<Loader>()
  const posts: Post[] = (data as unknown as Post[]) || ([] as Post[])
  return (
    <>
      <article className="hero">
        <a href="/users/register">Join Now</a>
        <h3>At Home In Wilderness</h3>
      </article>
      <article className="container">
        <section className="articles">
          <h2>Recent featured Articles</h2>
          <Posts posts={posts} />
        </section>
        <aside className="aside">
          <a
            className="button--success"
            target="_blank"
            href="https://www.youtube.com/watch?v=_r4FjjGOUs4"
            data-type="URL"
            data-id="https://equalizedigital.com"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            WildEarth
          </a>
          <a
            className="button--success"
            target="_blank"
            href="https://www.youtube.com/@PaintedDogTV"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            PaintedDogTV
          </a>
          <Link to="/about" className="button">
            About
          </Link>
          <Link to="/lists/new" className="button">
            Create Your bird List
          </Link>
          <Link to="/users/register" className="button button--primary">
            Join Now!
          </Link>
          <section className="cards">
            <section className="card">
              <h3>{bird.englishName}</h3>
              <hr />

              <p>{bird.englishName}</p>
              <p>{bird.taxonomy}</p>
              <Link to={`/taxonomy/${bird.id}`}>Learn more</Link>
            </section>
          </section>
        </aside>
      </article>
    </>
  )
}
