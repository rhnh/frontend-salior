import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { addBirdToList } from "~/models/list.server";

export const action: ActionFunction = async ({ params, request }) => {
  const form = await request.formData();
  const listId = params?.id;
  const englishName = form.get("taxonomy-english")?.toString();
  const taxonomy = form.get("taxonomy")?.toString();
  const location = form.get("location")?.toString();
  invariant(taxonomy, "Invalid Taxonomy");
  invariant(listId, "Invalid list id provided");
  invariant(englishName, "Invalid bird name");

  if (typeof listId !== "string") {
    throw new Error("Id must be string!");
  }
  await addBirdToList({ listId, englishName, taxonomy, location });

  return redirect(`/lists/${listId}`);
};
/**
 * @info This is for add any Bird to specific list
 * @returns
 */

export default function AddBird() {
  return (
    <form method="post">
      <p>
        <label htmlFor="taxonomy-english">Bird name</label>
        <input type="text" id="taxonomy-english" name="taxonomy-english" />
      </p>
      <p>
        <label htmlFor="taxonomy">Species</label>
        <input type="text" id="taxonomy" name="taxonomy" />
      </p>
      <p>
        <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" />
      </p>
      <button>Add</button>
    </form>
  );
}
