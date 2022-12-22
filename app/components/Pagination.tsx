import { Link, useSearchParams } from "react-router-dom";

const previous = (page: number = 0) => (page > 0 ? page - 1 : 1);
const next = (page: number = 0, total: number) =>
  page < total ? page + 1 : total;
const firstTwo = (total: number) =>
  total > 2 ? Array.from(new Array(2).keys()) : [1];

export const Pagination = ({
  total,
  rootPath,
  hasNextPage,
  hasPreviousPage,
}: {
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
        {firstTwo(total).map((p) => (
          <Link key={p} to={`${rootPath}?page=${p + 1}`}>
            {p + 1}
          </Link>
        ))}

        <Link to={`${rootPath}?page=${currentPage}`}>current</Link>
        {pages.length > 5 &&
          firstTwo(total)
            .reverse()
            .map((p) => (
              <Link key={p} to={`${rootPath}?page=${total - p}`}>
                {total - p}
              </Link>
            ))}
        {<Link to={`${rootPath}?page=${next(currentPage, total)}`}>Next</Link>}
        <Link to={`${rootPath}?page=${pages.length}`}>Last</Link>
      </section>
    </article>
  );
};
