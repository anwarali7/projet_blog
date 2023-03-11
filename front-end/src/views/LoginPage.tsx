import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function Login({ updateUser }: { updateUser: Function }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Previous route before arriving to Login page.
  const from = location.state?.from?.pathname || "/";

  // If connected, redirect to root.
  if (sessionStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const loginData = await axios.post('http://localhost:8000/login', {
        email,
        password
      });
      console.log(loginData);
      if (loginData.data.token) {
        sessionStorage.setItem('token', loginData.data.token);
        updateUser(loginData.data.user);

        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true });
      } else {
        console.error("Couldn't get login token.");
      }
    } catch (err) {
      // Have to parse this to show error under each
      // invalid field
      console.error(err);
    }
  }

  return (
    <div id="login-page">
      <h1>Blog</h1>
      <form id="login-form" className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Adresse email
          </label>
          <input
            type="email"
            name="email"
            id="email-input"
            autoComplete="username"
            placeholder="ex: mon@email.fr"
            className="form-control"
            defaultValue="admin@gmail.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="current-password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            id="current-password"
            autoComplete="current-password"
            className="form-control"
            defaultValue="Aa1234&&&&&"
          />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
      Login with
      <input type="text" readOnly value="admin@gmail.com" />
      <input type="text" readOnly value="Aa1234&&&&&" />
    </div>
  );
}