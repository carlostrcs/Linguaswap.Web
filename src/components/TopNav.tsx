import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { clearToken, isAuthenticated } from "../features/auth/auth";

export function TopNav() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <header className="topNav">
      <Link to="/" className="topNavBrand">
        LinguaSwap
      </Link>

      <nav className="topNavLinks">
        <Link to="/demo">Demo</Link>

        {loggedIn && <Link to="/libraries">Mis libraries</Link>}
        {loggedIn && <Link to="/progress">Progreso</Link>}

        {!loggedIn && <Link to="/login">Login</Link>}
        {!loggedIn && <Link to="/register">Register</Link>}

        {loggedIn && (
          <Button type="button" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </nav>
    </header>
  );
}