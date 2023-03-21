const About = () => {
  return (
    <article
      className="content layout about"
      aria-label="about this page"
      role={"contentinfo"}
    >
      <p>
        Safarilive.org is an open-source project, dedicated for the viewers of
        Safarilive
      </p>
      <p>Made this page for WildEarth.tv back then.</p>
      <ul>
        <h3>Thanks to:</h3>
        <li>
          <a href="https://unsplash.com/@hgudka97">
            Harshil Gudka for background picture
          </a>
        </li>
        <li>
          <a href="https://icomoon.io/">Icomoon.io</a>
        </li>
        <li>
          <a href="https://tinypng.com/">Tinypng</a>
        </li>
        <li>
          <a href="https://ebird.org/home">eBird</a>
        </li>
      </ul>
      <ul>
        <h3>Contact</h3>
        <li>
          <a href="https://twitter.com/safariliveorg">
            {" "}
            <i className="icon-twitter">@safariliveorg</i>
          </a>
        </li>
      </ul>
      <ul>
        <h3>Source code</h3>
        <li>
          <a href="https://github.com/rhnh/salior-remix">
            <i className="icon-github">Source Code</i>
          </a>
        </li>
      </ul>
    </article>
  )
}

export default About
