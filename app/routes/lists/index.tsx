import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getLists } from "~/models/list.server";
import { Link, useLoaderData } from "@remix-run/react";
import type { List } from "@prisma/client";

type LoaderData = {
  lists: Pick<List, "id" | "listname" | "username">[];
};

export const loader: LoaderFunction = async () => {
  const lists = await getLists();

  if (lists?.length <= 0) {
    return json([]);
  }
  return json({ lists });
};
function ListsIndex() {
  const { lists } = useLoaderData<LoaderData>();
  if (lists?.length <= 0) {
    return <p>No list found </p>;
  }
  return (
    <ul>
      {lists?.map((list) => (
        <li key={list.id}>
          <Link to={list.id}>{list.listname}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ListsIndex;
