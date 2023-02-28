import { useLocation } from "@remix-run/react";
import type { FC } from "react";
const NavBar: FC<{ isLogged: boolean; username?: string }> = ({
  isLogged,
  username,
}) => {
  const pathname = useLocation().pathname;
  const isActive = (pathname: string, origin: string) =>
    pathname === origin ? "nav-active" : "";
  // !don't replace a with NavLink, because in mobile the pages needs to be refreshed,
  // !  so that menu closes
  return (
    <nav>
      <section className="nav-logo">
        <a href="/">SafariLive.org</a>
      </section>
      <section className="nav-buttons">
        <input
          type="checkbox"
          id="checkbox"
          className="checkbox visuallyHidden"
        />
        <label htmlFor="checkbox">
          <section className="hamburger">
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar3"></span>
            <span className="bar bar4"></span>
          </section>
        </label>
        <section className="nav-menu-buttons">
          <ul className="nav-ul">
            <li>
              <a className={isActive(pathname, "/posts")} href="/posts">
                Articles
              </a>
            </li>
            <li>
              <a
                className={isActive(pathname, "/taxonomy/birds")}
                href="/birds"
              >
                Birds
              </a>
            </li>
            <li>
              <a className={isActive(pathname, "/lists")} href="/lists">
                Lists
              </a>
            </li>
            <li>
              <a className={isActive(pathname, "/about")} href="/about">
                About
              </a>
            </li>
            {!isLogged ? (
              <>
                <li>
                  <a
                    className={isActive(pathname, "/users/login")}
                    href="/users/login"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    className={isActive(pathname, "/users/register")}
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
                    className={isActive(pathname, "/users/profile")}
                    href="/users/profile"
                  >
                    {username}
                  </a>
                </li>
                <li>
                  <a
                    className={isActive(pathname, "/users/logout")}
                    href="/users/logout"
                  >
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </section>
      </section>
    </nav>
  );
};

export default NavBar;
