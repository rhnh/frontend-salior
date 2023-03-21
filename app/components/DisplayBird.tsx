import type { Taxonomy } from "@prisma/client"
import { Link } from "react-router-dom"
export const DisplayBird = ({
  taxonomy,
  englishName,
  rank,
  id,
  imageUrl,
  isAuthorized,
}: Partial<Taxonomy> & { isAuthorized: boolean }) => {
  if (id === undefined) {
    return <p>Something went wrong</p>
  }
  return (
    <article className="card">
      <Link className="bird-link" to={`/taxonomy/${id}`}>
        <img
          className="bird-link-img"
          src={imageUrl ?? ""}
          alt={englishName || ""}
        />
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
                <Link to={`/`}>edit</Link>
              </p>
              <p>
                <Link to={`/`}>delete</Link>
              </p>
            </>
          ) : null}
        </section>
      </section>
    </article>
  )
}
