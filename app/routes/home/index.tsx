import type { LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getFeaturedPost } from "~/models/post.server"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import Posts from "~/components/Posts"
import type { Post } from "@prisma/client"

export const loader: LoaderFunction = async () => {
  const posts = (await getFeaturedPost()) as unknown as Post[]
  invariant(posts, "No post found")
  return json<Post[]>(posts)
}

export default function HomeRouter() {
  const data = useLoaderData<Post[]>()
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
        </aside>
      </article>
    </>
  )
}
