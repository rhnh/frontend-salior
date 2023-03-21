import { Link, Outlet } from "react-router-dom";

export default function Taxonomy() {
  return (
    <article className="birds">
      <h3>
        <Link className="link" to="/birds">
          Birds
        </Link>
      </h3>
      <Outlet />
    </article>
  );
}
