import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { getTaxonomyPaginated } from "~/models/taxonomy.server"
import { useLoaderData, useLocation } from "@remix-run/react"
import type { PaginatedBirds } from "~/utils/types.server"
import { getLocalAuthenticatedUser } from "~/utils/user.server"
import { Pagination } from "~/components/Pagination"
import { fixTheId } from "tests/utils"
import type { TaxonomyAndId } from "utils/types.server"
import AllBirds from "~/components/Birds"
import type { Bird } from "@prisma/client"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchParam = url.searchParams
  const page = Number(searchParam.get("page")) || 1
  const limit = Number(searchParam.get("limit")) || 5
  const rawData = await getTaxonomyPaginated(page, limit)

  const data = rawData[0] as unknown as PaginatedBirds
  const authorizedUser = await getLocalAuthenticatedUser(request)
  const isAuthorized = authorizedUser?.role !== "user"

  const birds = {
    ...data,
    birds: data?.birds.map((bird: TaxonomyAndId) => fixTheId(bird)),
    isAuthorized,
  }
  return json(birds)
}

export default function Birds() {
  const { page, birds, totalBirds, hasNextPage, hasPreviousPage, totalPages } =
    useLoaderData<PaginatedBirds>()
  let { pathname } = useLocation()

  if (birds?.length <= 0 || birds === undefined) return <p>No Birds found</p>
  const allBirds = birds as unknown as Bird[]
  return (
    <article>
      <section className="birds-info">
        <p className="accent">
          There are <em> {totalBirds} </em>birds on this site!
        </p>
      </section>
      <Pagination
        total={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        rootPath={pathname}
        current={page}
      />

      <AllBirds birds={allBirds} />
    </article>
  )
}
