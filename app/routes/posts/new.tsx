import type { ActionFunction } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import { redirect } from "@remix-run/node";
import { getLocalAuthenticatedUser } from "~/utils/user.server";
import { isAuthorizedUser } from "utils/user.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title: string = form.get("title")?.toString() || "";
  const body: string = form.get("body")?.toString() || "";
  const user = await getLocalAuthenticatedUser(request);
  const username = user?.username;
  if (!username) return redirect("/users/login");
  if (isAuthorizedUser(user.role)) {
    await createPost({ username, title, body });
    return redirect("/posts");
  }
  return redirect("users/login");
};

export default function WriteNewArticle() {
  return (
    <article>
      <form method="post">
        <p>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p>
          <label htmlFor="body">Body</label>
          <textarea id="body" name="body" />
        </p>
        <p>
          <button type="submit">Post</button>
        </p>
      </form>
    </article>
  );
}
