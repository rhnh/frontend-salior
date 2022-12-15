import type { Taxonomy } from '@prisma/client'


export const DisplayBird = ({ taxonomy, englishName, listId }: Partial<Taxonomy>) => {
  return (
    <section> hahah {englishName}, hello {listId}</section>
  )
}
