import { json, redirect } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getTaxonomyById, updateTaxonomy } from "~/models/taxonomy.server"
import { Form, useLoaderData } from "@remix-run/react"
import type { Taxonomy } from "@prisma/client"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ params }) => {
  const id = params?.id
  invariant(id, "Invalid taxonomy id")
  const taxonomy = await getTaxonomyById(id)
  invariant(taxonomy, "Invalid Taxonomy")
  return json<Taxonomy>(taxonomy)
}

export const action: ActionFunction = async ({ request, params }) => {
  const id = params?.id
  const form = await request.formData()
  const taxonomy = form.get("taxonomy")
  const imageUrl = form.get("image")
  const englishName = form.get("englishName")
  const info = form.get("info")
  invariant(info, "Invalid info")
  invariant(id, "invalid id")
  invariant(taxonomy, "No valid taxonomy")
  invariant(imageUrl, "Invalid image")
  invariant(englishName, "Invalid english name")
  const t: Taxonomy = {
    id,
    taxonomy,
    englishName,
    imageUrl,
    info,
  } as unknown as Taxonomy
  const result = await updateTaxonomy(t)
  if (result) {
    return redirect(`/taxonomy/${id}`)
  }
  return null
}

export default function EditBird() {
  const { taxonomy, englishName, imageUrl, info } = useLoaderData<Taxonomy>()
  return (
    <section>
      <h3>Editing: </h3>
      <Form method="post">
        <p>
          <label htmlFor="englishName">English Name</label>
          <input
            type="text"
            name="englishName"
            id="englishName"
            defaultValue={englishName || ""}
          />
        </p>
        <p>
          <label htmlFor="taxonomy">Taxonomy</label>
          <input
            type="text"
            name="taxonomy"
            id="taxonomy"
            defaultValue={taxonomy || ""}
          />
        </p>
        <p>
          <label htmlFor="image">Image</label>
          <input
            type="text"
            name="image"
            id="image"
            defaultValue={imageUrl || ""}
          />
        </p>
        <p>
          <label htmlFor="info">Info</label>
          <textarea
            rows={20}
            cols={40}
            name="info"
            id="info"
            defaultValue={info || ""}
          />
        </p>
        <p>
          <button type="submit" className="button button--success">
            Save
          </button>
        </p>
      </Form>
    </section>
  )
}
