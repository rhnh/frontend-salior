import { Link, Outlet } from "@remix-run/react";

const Lists = () => {
  return (
    <article>
      <section>
        <h1>Lists</h1>
      </section>
      <section>
        <Link to="new">Create New List</Link>
      </section>
      <Outlet />
    </article>
  );
};

export default Lists;
