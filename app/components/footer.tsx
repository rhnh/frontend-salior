import { Link } from "@remix-run/react";


export default function Footer() {
  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label="footer Information"
    >
      <section className="footer-section">
        <h3>Information</h3>
        <ul>
          <li>
            <Link to="/about"> About Safarilive.org</Link>
          </li>
          <li>
            <Link to="https://github.com/rhnh/salior-remix">
              MIT {new Date().getFullYear()} &#169; Safarilive.org
            </Link>
          </li>
          <li>
            <a href="https://twitter.com/safariliveorg">
              <i className="icon-twitter"> Twitter</i>
            </a>
          </li>
        </ul>
      </section>

      <section className="footer-section">
        <h3>Source code</h3>
        <ul>
          <li>
            <a href="https://github.com/rhnh/salior-remix">
              <i className="icon-github"> code</i>
            </a>
          </li>
          <li>
            <a href="https://github.com/rhnh/salior-remix/issues">
              <i className="icon-github"> issues</i>
            </a>
          </li>
          <li>
            <Link to="/about">Credits</Link>
          </li>
        </ul>
      </section>
    </footer>
  )
}
