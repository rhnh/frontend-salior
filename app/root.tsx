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
import { getLocalAuthorizedUserId } from "utils/session.server";
import { getUserById } from "./models/user.server";
import type { ReactNode } from "react";
import { getLocalAuthorizedUser } from "utils/user.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: SITE_TITLE,
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  isAuthorized: boolean;
  username?: string
};
export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthorizedUser(request);
  const username = authorizedUser?.username
  if (!authorizedUser) return json<LoaderData>({ isAuthorized: false });
  else return json<LoaderData>({ isAuthorized: true, username });
};

function Document({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthorized: isLogged, username } = useLoaderData<LoaderData>() || false;
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <header>
            <NavBar isLogged={isLogged} username={username} />
          </header>
          {children}
          <footer>footer</footer>
          <ScrollRestoration />
          {/* <Scripts /> */}
          <LiveReload />
        </main>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document title="Safarilive.org">
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <section className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </section>
    </Document>
  );
}
