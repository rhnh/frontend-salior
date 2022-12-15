
const Login = () => {
  return (
    <article className="content">
      <section className="vh-centered">
        <form method="post">
          <p>
            <label htmlFor="username">Username</label><input type="text" id="username" name="username" />
          </p>
          <p>
            <label htmlFor="password">Password</label><input type="password" id="password" name="password" />
          </p>
          <p>
            <button type="submit">Register</button>
          </p>
        </form>
      </section>
    </article>
  )
}

export default Login