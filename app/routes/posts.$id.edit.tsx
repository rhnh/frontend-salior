import type { Post } from "@prisma/client"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { getLocalAuthenticatedUser } from "~/utils/user.server"
import { getPostById, updatePostById } from "~/models/post.server"

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const id = params.id
  invariant(id, "Invalid id")
  const title: string = form.get("title")?.toString() || ""
  const body: string = form.get("body")?.toString() || ""
  const image: string = form.get("imageUrl")?.toString() || ""
  invariant(title, "No title")
  invariant(body, "No body")
  invariant(image, "No noImage")
  const user = await getLocalAuthenticatedUser(request)
  if (!user) {
    return redirect("/login")
  }
  await updatePostById({
    id,
    title,
    body,
    username: user.username,
    imageUrl: image,
  })
  return redirect(`/posts/${id}`)
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  invariant(id, "Invalid id")

  const post = await getPostById(id)
  invariant(post, "No Post found")
  return json<Post>({ ...post })
}
export default function EditListById() {
  const { title, body, imageUrl } = useLoaderData<Post>()
  return (
    <article>
      <form method="post">
        <p>
          <label htmlFor="title">Title:</label>
          <input type={"text"} defaultValue={title} id="title" name="title" />
        </p>
        <p>
          <label htmlFor="imageUrl">Image:</label>
          <input
            type={"text"}
            defaultValue={imageUrl ?? ""}
            id="imageUrl"
            name="imageUrl"
          />
        </p>
        <p>
          <label htmlFor="body">Body:</label>
          <textarea
            rows={20}
            cols={80}
            defaultValue={body}
            name="body"
            id="body"
          />
        </p>
        <button type="submit" className="button">
          Save
        </button>
      </form>
      <Link to="..">Back</Link>
    </article>
  )
}
