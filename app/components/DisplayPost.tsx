import type { Post } from "@prisma/client"
import { Link } from "@remix-run/react"
import { shorten } from "tests/utils"

/**
 *
 * @param post,
 * @returns
 */
export default function DisplayPost({
  post,
  isTrim = false,
}: {
  post: Post
  isTrim?: boolean
}) {
  return (
    <article className="card">
      <figure>
        <Link to={`/posts/${post.id}`}>
          <img src={`${post.imageUrl}`} alt="" />
        </Link>
      </figure>
      <section className="card-details">
        <h3>
          <Link to={`/posts/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
        </h3>
        <p>
          {isTrim ? shorten(post.body) : post.body}
          <small>
            <Link className="link-effect" to={`/posts/${post.id}`}>
              read more
            </Link>
          </small>
        </p>
      </section>
    </article>
  )
}
