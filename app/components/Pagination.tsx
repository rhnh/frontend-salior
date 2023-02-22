import { Link, useSearchParams } from "react-router-dom";
import { getRowPageNumbers, next, previous } from "~/tools/pagination-tools";

export const Pagination = ({
  total,
  rootPath,
  hasNextPage,
  hasPreviousPage,
  current,
}: {
  current: number;
  total: number;
  rootPath: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 0;
  const pages = Array.from(new Array(total).keys());
  if (pages.length <= 1) {
    return null;
  }
  return (
    <article>
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to={`${rootPath}?page=1`}>First</Link>
        {<Link to={`${rootPath}?page=${previous(currentPage)}`}>previous</Link>}
        {getRowPageNumbers({
          totalPages: total,
          currentPage: current,
        }).map((p) => (
          <Link
            key={p}
            to={`${rootPath}?page=${p + 1}`}
            style={{ color: current === p + 1 ? "red" : "blue" }}
          >
            {p + 1}
          </Link>
        ))}

        {<Link to={`${rootPath}?page=${next(currentPage, total)}`}>Next</Link>}
        <Link to={`${rootPath}?page=${pages.length}`}>Last</Link>
      </section>
    </article>
  );
};
