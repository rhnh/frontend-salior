import { Link, Outlet } from "@remix-run/react";

export default function Posts() {
  return (
    <article>
      <Link to="new">Write a new article</Link>
      <Outlet />
    </article>
  );
}
