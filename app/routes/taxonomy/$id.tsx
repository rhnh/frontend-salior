import { json, redirect } from "@remix-run/node"
import invariant from "tiny-invariant"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import { getTaxonomyById } from "~/models/taxonomy.server"
import type { LoaderFunction } from "@remix-run/node"
import type { Bird, Taxonomy } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import type { TaxonomyAndId } from "~/utils/types.server"
import { Link } from "react-router-dom"
import { DisplayBird } from "~/components/DisplayBird"

interface LoaderData extends Partial<Taxonomy> {
  isAuthorized: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id
  invariant(id, "No Invalid id")
  const data = await getTaxonomyById(id)

  //authorization
  const authorizedUser = await getLocalAuthenticatedUser(request)
  if (!authorizedUser) return redirect("/users/login")
  const isAuthorized = isAuthorizedUser(authorizedUser?.role)
  if (data) {
    const bird = data as unknown as Bird
    return json<LoaderData>({ ...bird, isAuthorized })
  }
  return null
}

export default function BirdById() {
  const data = useLoaderData<LoaderData>()
  const { isAuthorized, ...bird } = data
  return (
    <article className=" layout">
      <section>
        <Link className="bird-link" to={`/taxonomy/${bird.id}`}>
          <figure>
            <img
              className="bird-link-img"
              src={bird.imageUrl ?? ""}
              alt={bird.englishName || ""}
            />
          </figure>
        </Link>
        <h3>{bird.englishName}</h3>
        <p className="accent">{bird.taxonomy}</p>
        <p>{bird.info}</p>
      </section>

      {isAuthorized === true ? (
        <section>
          <p>
            <Link
              className="button button--small"
              to={`/taxonomy/${bird.id}/edit`}
            >
              <i className="icon-edit"></i> Edit
            </Link>
          </p>
          <p>
            <Link
              className="button button--danger button--small"
              to={`/taxonomy/${bird.id}/remove`}
            >
              <i className="icon-trash"></i> Delete
            </Link>
          </p>
          <p>
            <Link
              className="button button--success button--small"
              to={`/taxonomy/${bird.id}/verify`}
            >
              <i className="icon-check"></i> Verify
            </Link>
          </p>
        </section>
      ) : null}
    </article>
  )
}
