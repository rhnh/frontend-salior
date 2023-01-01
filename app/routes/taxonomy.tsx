import { Link, Outlet } from 'react-router-dom'

export default function Taxonomy() {

  return (
    <article>
      <section>
        <Link to="/birds">Birds</Link>
      </section>
      <Outlet />
    </article>
  )
}
