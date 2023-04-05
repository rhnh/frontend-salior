import { Form, Link, Outlet, useLoaderData } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { getListBirdById } from "~/models/list.server"
import invariant from "tiny-invariant"
import type { LoaderFunction } from "@remix-run/node"
import { getLocalAuthenticatedUserId } from "~/utils/session.server"
import { getUserById } from "~/models/user.server"
import { fixTheId } from "tests/utils"
import type { ListWithId, TaxonomyList } from "~/utils/types.server"

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getLocalAuthenticatedUserId(request)
  if (!userId) {
    return redirect("/users/login")
  }
  const user = await getUserById(userId)
  if (!user?.username) {
    return redirect("/users/login")
  }
  const id = params?.id
  invariant(id, "Invalid list id")
  const rawList = await getListBirdById(id, user?.username)
  const data = rawList[0] as unknown as ListWithId
  const listWithId = fixTheId(data) as unknown as ListWithId
  const list = {
    ...listWithId,
    birds: listWithId.birds.map((bird) => fixTheId(bird)),
  } as unknown as TaxonomyList
  return json<TaxonomyList>(list)
}

export default function ShowList() {
  const { birds, id, listname } = useLoaderData<TaxonomyList>()
  if (!id) {
    return <p>Invalid list Id: {id}</p>
  }

  return (
    <article>
      <Link to="/lists">
        <i className="icon-first">...back</i>
      </Link>
      <h3>{listname}</h3>

      <Form method="post">
        <ul className="list">
          {birds.map((bird, i) => (
            <li key={i}>
              <Link to={`/taxonomy/${bird.id}`}>
                <p>
                  {bird.englishName} {bird.taxonomy}
                </p>
              </Link>
              <p>
                <Link
                  to={`/lists/birds/${bird.id}/remove?englishName=${bird.englishName}&listname=${listname}&listId=${id}`}
                >
                  <i className="icon-trash" />
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Form>
      <section>
        <h4>Settings</h4>
        <Link
          className="button button--success button--small"
          to={`/lists/birds/${id}/new`}
        >
          Add new
        </Link>
        <Link
          className="button button--danger button--small"
          to={`/lists/${id}/remove?listname=${listname}`}
        >
          <i className="icon-alert-triangle"></i> {` `}
          Delete entire list
        </Link>
        <Link
          className="button button--secondary button--small"
          to="/lists/new"
        >
          Create New List
        </Link>
      </section>
      <Outlet />
    </article>
  )
}

// export function ErrorBoundary() {
//   const { id } = useParams()
//   return (
//     <section className="error-container">
//       <p>
//         No list with the <em>{id}</em> {` `} id found!
//       </p>
//     </section>
//   )
// }
