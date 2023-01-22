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
  Scripts,
  // Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { SITE_TITLE } from "utils/config.server";
import NavBar from "./components/NavBar";
import stylesUrl from "~/styles/app.css";
import { getLocalAuthenticatedUserId } from "utils/session.server";
import { getUserById } from "./models/user.server";
import type { ReactNode } from "react";
import { getLocalAuthenticatedUser } from "utils/user.server";
import Footer from "./components/footer";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Safarilive.org",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  isAuthorized: boolean;
  username?: string | undefined;
};
export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request);
  if (!authorizedUser) return json<LoaderData>({ isAuthorized: false });
  else {
    const username = authorizedUser.username;
    return json<LoaderData>({ isAuthorized: true, username });
  }
};

function Document({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthorized: isLogged, username } =
    useLoaderData<LoaderData>() || false;
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            margin: 0,
          }}
        >
          <article>
            <header>
              <NavBar isLogged={isLogged} username={username} />
            </header>
            {children}
          </article>
          <footer>
            <Footer />
          </footer>
          <ScrollRestoration />
          <Scripts />
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
