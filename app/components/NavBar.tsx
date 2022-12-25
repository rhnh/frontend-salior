import type { LoaderFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";

import type { FC } from "react";

const NavBar: FC<{ isLogged: boolean }> = ({ isLogged }) => {
  return (
    <nav>
      <NavLink to="/">SafariLive.org</NavLink>
      <ul>
        <li>
          <NavLink to="/posts">Articles</NavLink>
        </li>
        <li>
          <NavLink to="/birds">Birds</NavLink>
        </li>
        <li>
          <NavLink to="/lists">Lists</NavLink>
        </li>
        {!isLogged ? (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        ) : (
          <NavLink to="/logout">Logout</NavLink>
        )}
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
