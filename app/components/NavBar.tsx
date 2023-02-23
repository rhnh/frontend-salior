import { NavLink } from "@remix-run/react";

import type { FC } from "react";
const NavBar: FC<{ isLogged: boolean; username?: string }> = ({
  isLogged,
  username,
}) => {
  return (
    <nav className="nav">
      <section className="nav-logo">
        <NavLink to="/">SafariLive.org</NavLink>
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
              <NavLink to="/posts">Articles</NavLink>
            </li>
            <li>
              <NavLink to="/birds">Birds</NavLink>
            </li>
            <li>
              <NavLink to="/lists">Lists</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            {!isLogged ? (
              <>
                <li>
                  <NavLink to="/users/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/users/register">Register</NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/users/profile">{username}</NavLink>
                </li>
                <li>
                  <NavLink to="/users/logout">Logout</NavLink>
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
