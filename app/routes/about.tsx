const About = () => {
  return (
    <article
      className="content layout about"
      aria-label="about this page"
      role={"contentinfo"}
    >
      <p>
        Safarilive.org is an open-source project, dedicated for the viewers of
        Safarilive of WildEarth.
      </p>
      <p>This page was made for WildEarth.tv back then.</p>
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
        <h3>Youtube channels</h3>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/watch?v=_r4FjjGOUs4"
            data-type="URL"
            data-id="https://equalizedigital.com"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            WildEarth
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@PaintedDogTV"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            PaintedDogTV
          </a>
        </li>
      </ul>

      <ul>
        <h3>Other useful Youtube channels</h3>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@AnimalFactFiles"
            data-type="URL"
            data-id="https://equalizedigital.com"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            Animal Fact Files
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@DeepMarineScenes"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            Deep Marine Scenes
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@saveafox"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            Save a fox
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@WickedWildlife/"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            Wicked Wildlife
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/@WickedWildlife/"
            rel="noreferrer"
            aria-describedby="new-window-0"
          >
            Animal Wonders Montana
          </a>
        </li>
      </ul>

      <ul>
        <h3>Source code</h3>
        <li>
          <a href="https://github.com/rhnh/salior-remix">
            <i className="icon-github"> Source Code</i>
          </a>
        </li>
      </ul>
      <ul>
        <h3>Contact</h3>
        <li>
          <a href="https://twitter.com/safariliveorg">
            <i className="icon-twitter"> safariliveorg</i>
          </a>
        </li>
      </ul>
    </article>
  )
}

export default About
