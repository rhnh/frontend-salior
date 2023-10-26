import type { LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getFeaturedPost } from "~/models/post.server"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import Posts from "~/components/Posts"
import { type Post, type Taxonomy } from "@prisma/client"
import { getRandomTaxonomy } from "~/models/taxonomy.server"


import type { TaxonomyAndId } from "~/utils/types.server"
import { fixTheId } from "~/utils/base"


interface Loader {
  bird: Taxonomy
  posts: Post[],

}
export const loader: LoaderFunction = async () => {
  const posts = (await getFeaturedPost()) as unknown as Post[]
  invariant(posts, "No post found")
  const birds = (await getRandomTaxonomy()) as unknown as TaxonomyAndId[]
  invariant(birds, "No bird found")

  const bird = {

    ...fixTheId<TaxonomyAndId>(birds[0])
  } as unknown as Taxonomy
  return json<Loader>({ posts, bird })
}

export default function HomeRouter() {
  const { posts: data, bird, } = useLoaderData<Loader>()
  const posts: Post[] = (data as unknown as Post[]) || ([] as Post[])

  return (
    <>
      <article className="hero">
        <a href="/register">Join Now</a>
        <h3>At Home In Wilderness</h3>
      </article>
      <article className="container">
        <section className="articles">
          <h2>Recent Articles</h2>
          {posts?.length ? <Posts posts={posts} /> : <p className="content">no Featured post</p>}
        </section>
        {bird && bird.englishName ? <aside className="aside">
          <section className="cards">
            <section className="card card-deco">
              <h3>{bird.englishName}</h3>
              <figure>
                <Link to={`/taxonomy/${bird.id}`}>
                  <img src={`${bird.imageUrl}`} alt="" />
                </Link>
              </figure>
              <p>{bird.englishName}</p>
              <p>{bird.taxonomy}</p>
              <Link to={`/taxonomy/${bird.id}`}>Learn more</Link>
            </section>
          </section>
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
          <Link to="/register" className="button button--primary">
            Join Now!
          </Link>
        </aside> : <p className="content">No featured birds</p>}
      </article>
    </>
  )
}
