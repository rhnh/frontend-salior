import { json } from "@remix-run/node";
import { getUnApproved } from "~/models/taxonomy.server";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
type LoaderData = {
  birds: {
    _id: { $oid: string };
    englishName: string;
    parent: string;
    username: string;
    image: string;
    info: string;
    rank: string;
    taxonomy: string;
    ancestors: string[];
    isApproved: false;
    createdAt: { $date: string };
    updatedAt: { $date: string };
  };
};
export const loader: LoaderFunction = async () => {
  const data = await getUnApproved();
  const taxonomies = data as unknown as LoaderData[];
  return json<LoaderData[]>(taxonomies);
};
export default function Verify() {
  const data = useLoaderData<LoaderData[]>();
  return (
    <section>
      {data.map((taxonomy, i) => (
        <section key={i}>
          <p>
            <Link to={`/taxonomy/${taxonomy.birds._id.$oid}/verify`}>
              {taxonomy.birds.taxonomy}
            </Link>{" "}
            added by {taxonomy.birds.username}
          </p>
        </section>
      ))}
    </section>
  );
}
