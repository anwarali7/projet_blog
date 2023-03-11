import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from 'react';

import LoginPage from './views/LoginPage'
import PostsPage from './views/PostsPage';
import PostPage from './views/PostPage';
import UserPage from './views/UserPage';
import CreateUser from './views/CreateUser';

import UserLogo from "./assets/user.svg";
import './App.css';

export default function App() {
  // User information stored in state.
  const [user, setUser] = useState<Object>({});

  useEffect(() => {
    console.log("App.tsx user state: ", user);
  }, [user]);

  const updateUser = (user: Object) => {
    setUser(user);
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage updateUser={updateUser} />} />
      <Route element={<Layout user={user} updateUser={updateUser} />}>
        <Route path="/" element={<Navigate to="/posts" replace />}
        />
        <Route path="/posts"
          element={
            <RequireAuth>
              <PostsPage />
            </RequireAuth>
          }
        />
        <Route path="/post"
          element={
            <RequireAuth>
              <PostPage />
            </RequireAuth>
          }
        />
        <Route path="/profile"
          element={
            <RequireAuth>
              <UserPage user={user} />
            </RequireAuth>
          }
        />
        <Route path="/createuser"
          element={
            <RequireAuth>
              {/* TODO : require admin */}
              <CreateUser />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}

// Layout component with a navbar and Outlet to render child routes.
function Layout({ user, updateUser }: { user: any, updateUser: Function }) {
  let navigate = useNavigate();

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Blog</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/posts" className="nav-link">Articles</Link>
              </li>
              {/* A enlever une fois qu'on a mis en place la navigation après click sur un article */}
              <li className="nav-item">
                <Link to="/post" className="nav-link">Article</Link>
              </li>
              {user.isAdmin ?
                <li className="nav-item">
                  <Link to="/createuser" className="nav-link">+ Utilisateur</Link>
                </li>
                : ""
              }
            </ul>

            <Link to="/profile" className="nav-link">
              <img
                className="user-image"
                // src="https://placekitten.com/50/40" 
                src={user.photo ? user.photo : UserLogo}
                alt="user profile image" />
            </Link>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                sessionStorage.removeItem('token');
                updateUser({});
                navigate("/login");
              }}
            >Log Out
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

/**
 * Redirect user to /login if not logged in.
 * Wrap this around protected routes.
 */
function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation();

  if (!sessionStorage.getItem("token")) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
