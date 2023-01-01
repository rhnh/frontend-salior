import { json } from "@remix-run/node"
import { getUnApproved } from "~/models/taxonomy.server"
import { objectIdToString } from "utils/tools.server"
import type { LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import type { TaxonomyAndId } from "utils/types.server"
type LoaderData = {
  _id: { ob: string }
  username: 'john',
  role: 'mod',
  birds: TaxonomyAndId[]
}
export const loader: LoaderFunction = async () => {
  const data = await getUnApproved()
  const taxonomies = data[0] as unknown as LoaderData
  return json<LoaderData>(taxonomies)
}
export default function Verify() {
  const data = useLoaderData<LoaderData>();
  console.log(data.birds)
  return (
    <section>
      {data?.birds.map(bird => {

        return <>
          <section>

            <dl key={objectIdToString(data._id)}>
              <dt>
                Name:
              </dt>
              <dd>
                {bird.englishName}
              </dd>
              <dt>
                Taxonomy:
              </dt>
              <dd>
                <Link to={`/taxonomy/${objectIdToString(bird?._id)}/verify`}>
                  {bird.taxonomy}
                </Link>
              </dd>
              <dt>Info:</dt>
              <dd>{bird?.info}</dd>
              <dt>isApproved:</dt>
              <dd>
                {bird.isApproved ? <p>Approved</p> : <p>Not Approved</p>}
              </dd>
            </dl>
          </section>
          <section>
            <Link to={`/taxonomy/${objectIdToString(data._id)}`}>Click here to Approved this Taxonomy</Link>
          </section>
        </>
      })}
    </section>
  )
}
