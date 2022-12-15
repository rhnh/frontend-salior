import type { Taxonomy } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getListBirdById } from "~/models/list.server";
import invariant from "tiny-invariant";

type Birds =
  | Pick<Taxonomy, "createdAt" | "updatedAt" | "englishName" | "taxonomy"> & {
      _id: string;
    };
type UserList = {
  _id: string;
  username: string;
  listname: string;
  birds: Birds[];
};
type LoaderData = {
  list: UserList;
  id: string; //list id
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params?.id;
  invariant(id, "Invalid list id");
  const list = await getListBirdById(id);
  return json({ list: list[0], id });
};

export default function List() {
  const { list, id } = useLoaderData<LoaderData>();

  if (!id) {
    return <p>Invalid list Id: {list?._id}</p>;
  }

  return (
    <article>
      <section>{list.listname}</section>
      <Link
        to={`/lists/${Object.values(list._id).toString()}/remove?listname=${
          list.listname
        }`}
      >
        delete entire list
      </Link>
      <form method="post">
        <ul>
          {list.birds.map((bird) => (
            <li key={bird._id}>
              <p>
                {bird.englishName} {bird.taxonomy}
              </p>
              <p>
                {/**
                 * @info
                 * ! using Object.values(), because of Prisma aggregateRaw
                 * returns _id as an Object, instead of id.
                 * @todo need to search for alternative solution
                 */}
                <Link
                  to={`/lists/birds/${Object.values(
                    bird._id
                  ).toString()}/remove?englishName=${
                    bird.englishName
                  }&listname=${list.listname}&listId=${id}`}
                >
                  x
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </form>
      <section>
        <Link to={`/lists/birds/${id}/new`}>Add new</Link>
      </section>
      <Outlet />
    </article>
  );
}
