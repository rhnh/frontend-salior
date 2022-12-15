import { NavLink } from '@remix-run/react'


const NavBar = () => {
  return (
    <nav>
      <NavLink to="/">SafariLive.org</NavLink>
      <ul>
        <li><NavLink to="/posts">Articles</NavLink></li>
        <li><NavLink to="/birds">Birds</NavLink></li>
        <li><NavLink to="/lists">Lists</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
    </nav>
  )
}

export default NavBar