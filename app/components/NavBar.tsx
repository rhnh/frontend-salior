import { NavLink } from "@remix-run/react";

import type { FC } from "react";

const NavBar: FC<{ isLogged: boolean; username?: string }> = ({
  isLogged,
  username,
}) => {
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
    </nav>
  );
};

export default NavBar;
