import { json } from "@remix-run/node"
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node"

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  // Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import NavBar from "./components/NavBar"
import globalStyle from "~/styles/global.css"
import navStyle from "~/styles/nav.css"
import icons from "~/styles/assets/icons/icons.css"
import appStyle from "~/styles/app.css"

import type { ReactNode } from "react"
import { getLocalAuthenticatedUser } from "utils/user.server"
import Footer from "./components/footer"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyle },
    { rel: "stylesheet", href: appStyle },
    { rel: "stylesheet", href: navStyle },
    { rel: "stylesheet", href: icons },
  ]
}

export const meta: MetaFunction = () => {
  const description = `Safarilive.org, At home in wildness`
  return {
    charset: "utf-8",
    description,
    title: "Safarilive",
    viewport: "width=device-width, initial-scale=1.0",
    keywords: "Safarilive,Safari, live",
    "twitter:creator": "@safariliveorg",
    "twitter:site": "@safariliveorg",
    "twitter:title": "Safarilive",
    "twitter:description": description,
  }
}

type LoaderData = {
  isAuthorized: boolean
  username?: string | undefined
}
export const loader: LoaderFunction = async ({ request }) => {
  const authorizedUser = await getLocalAuthenticatedUser(request)
  if (!authorizedUser) return json<LoaderData>({ isAuthorized: false })
  else {
    const username = authorizedUser.username
    return json<LoaderData>({ isAuthorized: true, username })
  }
}

function Document({ children, title }: { children: ReactNode; title: string }) {
  const { isAuthorized: isLogged, username } =
    useLoaderData<LoaderData>() || false
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body>
        <header className="header">
          <NavBar isLogged={isLogged} username={username} />
        </header>
        <main role="main">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <Footer />
        </main>
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document title="Safarilive.org">
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <section>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </section>
    </Document>
  )
}
