import { Link } from "@remix-run/react"


const Register = () => {
  return (
    <article className="content">
      <article className="card">
        <section className="vh-centered">
          <form method="post" >
            <p>
              <label htmlFor="username">Username</label><input type="text" id="username" name="username" />
            </p>
            <p>
              <label htmlFor="password">Password</label><input type="password" id="password" name="password" />
            </p>
            <p>
              <label htmlFor="confirm-password">Confirm Your Password</label><input type="password" id="confirm-password" name="confirm-password" />
            </p>
            <p>
              <button type="submit">Register</button>
            </p>
          </form>
        </section>
        <section>
          <Link to="register">Register</Link>
        </section>
      </article>
    </article>
  )
}

export default Register