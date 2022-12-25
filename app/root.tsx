import { json } from "@remix-run/node";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  // Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { SITE_TITLE } from "utils/config.server";
import NavBar from "./components/NavBar";
import stylesUrl from "~/styles/app.css";
import { getLoggedUserId } from "utils/session.server";
import { getUserById } from "./models/user.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: SITE_TITLE,
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  isLogged: boolean;
};
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getLoggedUserId(request);
  if (userId) {
    const user = await getUserById(userId);
    if (user?.id) {
      return json<LoaderData>({ isLogged: true });
    }
    return json<LoaderData>({ isLogged: false });
  }
  return json<LoaderData>({ isLogged: false });
};

export default function App() {
  const { isLogged } = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <header>
            <NavBar isLogged={isLogged} />
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
