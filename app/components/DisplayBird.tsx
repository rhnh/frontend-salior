import type { Taxonomy } from "@prisma/client"
import { Link } from "react-router-dom"
export const DisplayBird = ({
  taxonomy,
  englishName,
  id,
  imageUrl,
  isAuthorized,
  info,
  clsName,
}: Partial<Taxonomy> & {
  isAuthorized: boolean

  clsName?: string
}) => {
  if (id === undefined) {
    return <p>Something went wrong</p>
  }
  return (
    <article className={`card ${clsName}`}>
      <Link className="bird-link" to={`/taxonomy/${id}`}>
        <figure>
          {imageUrl && imageUrl?.length > 0 && (
            <img
              className="bird-link-img"
              src={imageUrl ?? ""}
              alt={englishName || ""}
            />
          )}
        </figure>
      </Link>
      <section className="card-details">
        <section className="bird-info-more">
          <h3>{englishName}</h3>
          <p className="accent">{taxonomy}</p>
        </section>
        <section className="bird-info--admin">
          <p>
            <Link
              to={`/lists/birds/${id}/add?englishName=${englishName}&taxonomy=${taxonomy}`}
              className="icon-link"
            >
              <i className="icon-plus-circle icon"></i>
            </Link>
          </p>
          {isAuthorized === true ? (
            <>
              <p>
                <Link to={`/taxonomy/${id}/edit`}>
                  <i className="icon-edit"></i>
                </Link>
              </p>
              <p>
                <Link to={`/taxonomy/${id}/remove`}>
                  <i className="icon-trash"></i>
                </Link>
              </p>
              <p>
                <Link to={`/taxonomy/${id}/verify`}>
                  <i className="icon-check"></i>
                </Link>
              </p>
            </>
          ) : null}
        </section>
      </section>
    </article>
  )
}
