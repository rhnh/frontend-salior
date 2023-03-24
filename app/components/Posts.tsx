import type { Post } from "@prisma/client"
import DisplayPost from "./DisplayPost"

export default function Posts({ posts }: { posts: Post[] }) {
  return (
    <article className="cards layout">
      {posts.map((post) => (
        <DisplayPost key={post.id} post={post} isTrim={true} />
      ))}
    </article>
  )
}
