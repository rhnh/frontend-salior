import { Link } from "react-router-dom";
import type { TaxonomyAndId } from "utils/types.server";

export const DisplayBird = ({
  taxonomy,
  englishName,
  rank,
  image,
  id,
}: Partial<TaxonomyAndId>) => {
  return (
    <article style={{ display: "flex", gap: "4px" }}>
      <section>
        <img src="" alt="" width={100} height={100} />
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
      </section>
    </article>
  );
};
