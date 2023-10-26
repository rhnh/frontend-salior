import type { Post, Role } from "@prisma/client"
import type { ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { getLocalAuthenticatedUser } from "~/utils/user.server"
import { getPostById, getRecentPosts } from "~/models/post.server"
import { shorten } from "~/utils/base"


type LoaderData = {
  post: Post
  recentPosts: Post[]
  isOwner: boolean
  role: Role
}
export const loader: ActionFunction = async ({ request, params }) => {
  const id = params.id
  invariant(id, "Invalid post id")
  const user = await getLocalAuthenticatedUser(request)
  const post = (await getPostById(id)) as unknown as Post
  invariant(post, "No Post found")
  const recentPosts = (await getRecentPosts({
    total: 3,
  })) as unknown as Post[]
  invariant(recentPosts, "No recent Posts")
  // if (!user) return redirect("/login");
  if (!user) {
    return json<LoaderData>({ post, recentPosts, isOwner: false, role: "user" })
  }

  const owner = user.username
  const role = user.role

  const isOwner = post.username === owner
  return json<LoaderData>({ post, recentPosts, isOwner, role })
}

export default function ArticleById() {
  const { isOwner, role, post, recentPosts } = useLoaderData<LoaderData>()
  const posts: Post[] = recentPosts as unknown as Post[]
  const isAuthorized = role === "admin" || role === "mod"
  return (
    <article className="post-id layout">
      <section className="post-id--post">
        <Link to="/posts">
          <i aria-label="back" className="icon-first">
            {`...`}back
          </i>
        </Link>
        <h3>{post.title}</h3>
        <img src={post?.imageUrl || ""} alt="" />
        <p>{post.body}</p>
        <p>
          {(isOwner || isAuthorized === true) && (
            <Link className="button button--danger button--small" to={`remove`}>
              <i className="icon-trash"></i>
              delete this post
            </Link>
          )}
        </p>
        <p>
          {(isOwner || isAuthorized === true) && (
            <Link className="button button--success button--small" to={`edit`}>
              <i className="icon-edit"></i>
              Edit
            </Link>
          )}
        </p>
        <p>
          {isAuthorized === true ? (
            <Link className="button button--small" to={`featured`}>
              <i className="icon-check"></i> Set featured
            </Link>
          ) : null}
        </p>
      </section>
      <section className="post-id--recent">
        <h3>Recent posts</h3>
        {posts.map((post) => (
          <section key={post.id}>
            <h4>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h4>
            <p>{shorten(post.body, 30, true)} ...</p>
          </section>
        ))}
      </section>
    </article>
  )
}
