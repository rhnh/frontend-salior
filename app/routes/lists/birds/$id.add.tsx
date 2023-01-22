import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getLocalAuthenticatedUser } from "~/utils/user.server";
import { addBirdToList, getListsByUsername } from "~/models/list.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getLocalAuthenticatedUser(request);

  if (user) {
    const lists = await getListsByUsername(user?.username);
    return json({ lists });
  }
  return json({ lists: [] });
}

export async function action({ request, params }: ActionArgs) {
  const id = params.id;
  invariant(id, "Invalid Id");
  const form = await request.formData();
  const listId = form.get("listId")?.toString();
  invariant(listId, "Invalid list Id");
  await addBirdToList({ listId, birdId: id });

  return redirect(`/lists/${listId}`);
}

/**
 * @info This is for add specific Bird to any list
 * @returns
 */
export default function AddToBirdToList() {
  const { lists } = useLoaderData<typeof loader>();
  const [searchParam] = useSearchParams();
  const englishName = searchParam.get("englishName");
  if (lists.length <= 0) {
    return (
      <section>
        Oops, You have don't have any list.{" "}
        <Link to="/lists/new/">Create new List</Link>
      </section>
    );
  }
  return (
    <form method="post">
      Adding {englishName} to your list below {` `}
      <select name="listId" id="listId">
        <option value={0}>Select your list</option>
        {lists.map((list, i) => (
          <option value={list.id} key={list.id}>
            {list.listname}
          </option>
        ))}
      </select>
      {` `}
      <button type="submit">Add</button>
    </form>
  );
}
