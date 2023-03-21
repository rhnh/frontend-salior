import { useLocation } from "@remix-run/react"
import type { FC } from "react"
import logo from "~/styles/assets/images/logo.png"
const NavBar: FC<{ isLogged: boolean; username?: string }> = ({
  isLogged,
  username,
}) => {
  const pathname = useLocation().pathname
  const isActive = (pathname: string, origin: string) =>
    pathname === origin ? "active" : ""
  // !don't replace a with NavLink, because in mobile the pages needs to be refreshed,
  // !  so that menu closes
  return (
    <nav className="nav" role="navigation">
      <a href="/">
        <picture>
          <img className="logo" src={`${logo}`} alt="Safarilive.org" />
        </picture>
      </a>
      <input
        type="checkbox"
        id="checkbox"
        className="checkbox visuallyHidden"
      />
      <label htmlFor="checkbox">
        <span className="hamburg"></span>
      </label>

      <ul className="nav-ul">
        <li>
          <a className={`nav-link ${isActive(pathname, "/home")}`} href="/home">
            Home
          </a>
        </li>
        <li>
          <a
            className={`nav-link ${isActive(pathname, "/posts")}`}
            href="/posts"
          >
            Articles
          </a>
        </li>
        <li>
          <a
            className={`nav-link ${isActive(pathname, "/taxonomy/birds")}`}
            href="/birds"
          >
            Birds
          </a>
        </li>
        <li>
          <a
            className={`nav-link ${isActive(pathname, "/lists")}`}
            href="/lists"
          >
            Lists
          </a>
        </li>
        <li>
          <a
            className={`nav-link ${isActive(pathname, "/about")}`}
            href="/about"
          >
            About
          </a>
        </li>
        {!isLogged ? (
          <>
            <li>
              <a
                className={`nav-link ${isActive(pathname, "/users/login")}`}
                href="/users/login"
              >
                Login
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${isActive(pathname, "/users/register")}`}
                href="/users/register"
              >
                Register
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a
                className={`nav-link ${isActive(pathname, "/users/profile")}`}
                href="/users/profile"
              >
                {username}
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${isActive(pathname, "/users/logout")}`}
                href="/users/logout"
              >
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default NavBar
