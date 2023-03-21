import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getTaxonomyById, setApproved } from "~/models/taxonomy.server"
import { Link, useLoaderData } from "@remix-run/react"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import { destroySession, getSession } from "~/utils/session.server"
import type { Taxonomy } from "@prisma/client"

export const loader: LoaderFunction = async ({ params, request }) => {
  const isAuthenticatedUser = await getLocalAuthenticatedUser(request)
  if (!isAuthenticatedUser) {
    return redirect("/users/login")
  }

  if (isAuthorizedUser(isAuthenticatedUser.role) === false) {
    const session = await getSession(request.headers.get("Cookie"))
    if (typeof session === "object") {
      return redirect("/users/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    }
  }
  const id = params?.id
  invariant(id, "Invalid id")
  const taxonomy = await getTaxonomyById(id)

  if (!taxonomy) {
    throw new Response("Invalid taxonomy", { status: 404 })
  }
  return json<Taxonomy>(taxonomy)
}

export const action: ActionFunction = async ({ params }) => {
  const id = params?.id
  invariant(id, "Invalid id")
  const taxonomy = await getTaxonomyById(id)
  if (!taxonomy) {
    throw new Response("Invalid taxonomy", { status: 404 })
  }
  const taxonomyId = taxonomy.id
  await setApproved({ id: taxonomyId, isApproved: true })
  return redirect("/taxonomy/verify")
}

export default function ApprovedBird() {
  const taxonomy = useLoaderData<Taxonomy>()

  return (
    <article>
      <section></section>
      <form method="post">
        <p>{taxonomy.englishName}</p>
        <p>{taxonomy.taxonomy}</p>
        <p>{taxonomy.parent}</p>
        <p>{taxonomy.rank}</p>
        <p>{taxonomy.info}</p>
        <dl>
          <dt>Ancestors</dt>
          {taxonomy.ancestors.map((ancestor, i) => (
            <dd key={i}>{ancestor}</dd>
          ))}
        </dl>
        <img src={`${taxonomy.imageUrl}`} alt={`${taxonomy.taxonomy}`} />
        <p>
          <button type="submit" className="button button--success">
            Submit
          </button>
          <Link
            className="button button--small"
            to={`/taxonomy/${taxonomy.id}/edit`}
          >
            <i className="icon-edit"></i>
            Edit
          </Link>
        </p>
      </form>
    </article>
  )
}
