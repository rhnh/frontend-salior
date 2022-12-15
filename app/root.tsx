import type { MetaFunction, LinksFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  // Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { SITE_TITLE } from "utils/config";
import NavBar from "./components/NavBar";
import stylesUrl from "~/styles/app.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: SITE_TITLE,
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <header>
            <NavBar />
          </header>
          <Outlet />
          <footer>footer</footer>
          <ScrollRestoration />
          {/* <Scripts /> */}
          <LiveReload />
        </main>
      </body>
    </html>
  );
}
