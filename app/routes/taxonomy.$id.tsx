import { json } from "@remix-run/node"
import invariant from "tiny-invariant"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import { getTaxonomyById } from "~/models/taxonomy.server"
import type { LoaderFunction } from "@remix-run/node"
import type { Taxonomy } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { DisplayBirdDetail } from "~/components/DisplayBirdDetail"

interface LoaderData extends Partial<Taxonomy> {
  isAuthorized: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id
  invariant(id, "No Invalid id")
  const data = await getTaxonomyById(id)

  //authorization
  const authorizedUser = await getLocalAuthenticatedUser(request)
  // if (!authorizedUser) return redirect("/login")
  const isAuthorized = isAuthorizedUser(authorizedUser?.role || "user")
  if (data) {
    const bird = data as unknown as Taxonomy
    return json<LoaderData>({ ...bird, isAuthorized })
  }
  return null
}

export default function BirdById() {
  const data = useLoaderData<LoaderData>()
  const { isAuthorized, ...bird } = data
  return (
    <article className="layout read">
      <DisplayBirdDetail
        englishName={bird.englishName}
        id={bird.id}
        rank={bird.rank}
        taxonomy={bird.taxonomy}
        isAuthorized={isAuthorized}
        info={bird.info}
        showDetail={true}
        imageUrl={bird.imageUrl}
        clsName="read"
      />
    </article>
  )
}
