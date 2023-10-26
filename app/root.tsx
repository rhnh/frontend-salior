
import { json, type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { getLocalAuthenticatedUser } from "./utils/user.server";
import type { LoggedUserLoader } from "./utils/session.server"
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import globalStyle from "~/styles/global.css"
import navStyle from "~/styles/nav.css"
import icons from "~/styles/assets/icons/icons.css"
import appStyle from "~/styles/app.css"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyle },
    { rel: "stylesheet", href: appStyle },
    { rel: "stylesheet", href: navStyle },
    { rel: "stylesheet", href: icons },
  ]
}


export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request)

  if (!authorizedUser) return json<LoggedUserLoader>({ isAuthorized: false })
  const username = authorizedUser.username
  return json<LoggedUserLoader>({ isAuthorized: true, username })
}
export default function App() {
  const { isAuthorized: isLogged, username } =
    useLoaderData<LoggedUserLoader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="header">
          <NavBar isLogged={isLogged} username={username} />
        </header>
        <main>

          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}


type ErrorType = {
  message: string,
}
export function ErrorBoundary() {
  const error = useRouteError() as ErrorType
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <p className="content error">
          Something went wrong, {error?.message ?? error?.message}
        </p>
        <Scripts />
      </body>
    </html>
  );
}