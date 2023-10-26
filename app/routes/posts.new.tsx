import type { ActionFunction } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import { redirect } from "@remix-run/node";
import { getLocalAuthenticatedUser, isAuthorizedUser } from "~/utils/user.server";

import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title: string = form.get("title")?.toString() || "";
  const body: string = form.get("body")?.toString() || "";

  const image: string =
    form.get("image")?.toString() || "/assets/placeholder.jpg";
  invariant(title, "No title provided");

  const user = await getLocalAuthenticatedUser(request);
  const username = user?.username;
  if (!username) return redirect("/login");
  if (isAuthorizedUser(user.role)) {
    await createPost({ username, title, body, image });
    return redirect("/posts");
  }
  return redirect("users/login");
};

export default function WriteNewArticle() {
  return (
    <article className="new-post" role="form">
      <form method="post" aria-label="Write a new article">
        <p>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p>
          <label htmlFor="body">Body</label>
          <textarea id="body" name="body" rows={20} cols={30} />
        </p>
        <p>
          <label htmlFor="image">Image</label>
          <input type="text" id="image" name="image" />
        </p>
        <p>
          <button type="submit">Post</button>
        </p>
      </form>
    </article>
  );
}
