import { Link, useSearchParams } from "@remix-run/react";
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
    <article className="pagination">
      <section role="navigation" className="pagination-nav">
        <Link
          aria-roledescription="navigates to the first page"
          aria-label="first"
          className="pagination-links"
          to={`${rootPath}?page=1`}
        >
          <i className="icon-first" aria-label="Page 1" />
        </Link>

        <Link
          className="pagination-links"
          aria-label="previous"
          to={`${rootPath}?page=${previous(currentPage)}`}
        >
          <i className="icon-back flipH"></i>
        </Link>
      </section>
      <section className="pagination-nav pagination-numbers">
        {getRowPageNumbers({
          totalPages: total,
          currentPage: current,
          numberOfPages: 4,
        }).map((p) => (
          <Link
            key={p}
            aria-label={`page ${p + 1}`}
            to={`${rootPath}?page=${p + 1}`}
            className={`pagination-links ${current === p + 1 ? "pagination-links--active" : ""
              }`}
          >
            {p + 1}
          </Link>
        ))}
      </section>
      <section className="pagination-nav">
        {
          <Link
            className="pagination-links"
            aria-label="next"
            to={`${rootPath}?page=${next(currentPage, total)}`}
          >
            <i className="icon-forward"></i>
          </Link>
        }
        <Link
          aria-label="last"
          className="pagination-links"
          to={`${rootPath}?page=${pages.length}`}
        >
          <i className="icon-fast-forward" />
        </Link>
      </section>
    </article>
  );
};
