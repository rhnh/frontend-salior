import type { Taxonomy } from "@prisma/client"
import { DisplayBird } from "./DisplayBird"

export default function AllBirds({
  birds,
  isAuthorized = false,
}: {
  isAuthorized?: boolean
  birds: Taxonomy[]
}) {
  return (
    <article className="cards">
      {birds.map((bird) => (
        <DisplayBird key={bird.id} isAuthorized={isAuthorized} {...bird} />
      ))}
    </article>
  )
}
