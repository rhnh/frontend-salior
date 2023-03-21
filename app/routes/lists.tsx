import { Link, Outlet } from "@remix-run/react"

const Lists = () => {
  return (
    <section className="layout">
      <h1>Lists</h1>
      <Outlet />
      <Link className="button button--secondary button--small" to="new">
        Create New List
      </Link>
    </section>
  )
}

export default Lists
