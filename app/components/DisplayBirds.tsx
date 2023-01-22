import { Link } from "react-router-dom";
import type { TaxonomyAndId } from "~/utils/types.server";

export const DisplayBirds = ({
  taxonomy,
  englishName,
  rank,
  image,
  id,
  isAuthorized,
}: Partial<TaxonomyAndId> & { isAuthorized: boolean }) => {
  if (id === undefined) {
    return <p>Wow</p>;
  }
  return (
    <article style={{ display: "flex", gap: "4px" }}>
      <section>
        <Link to={`/taxonomy/${id}`}>
          <img src="" alt="" width={100} height={100} />
        </Link>
      </section>
      <section>
        <dl>
          <dt>Name</dt>
          <dd>{englishName}</dd>
          <dt>Species</dt>
          <dd>{taxonomy}</dd>
        </dl>
      </section>
      <section>
        <p>
          <Link
            to={`/lists/birds/${id}/add?englishName=${englishName}&taxonomy=${taxonomy}`}
          >
            Add new
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
    </article>
  );
};
