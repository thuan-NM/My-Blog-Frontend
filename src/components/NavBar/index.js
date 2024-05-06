import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setIsLoggedIn(storedToken !== null);
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid d-flex justify-content-between">
        {/* Other Navbar elements */}
        <div className="d-flex">
          {isLoggedIn ? (
            <>
              {/* Show logged-in buttons */}
              <button className="btn btn-light btn-icon">
                <i className="bi bi-chat-left-heart-fill"></i>
              </button>
              <button className="btn btn-light btn-icon">
                <i className="bi bi-bell-fill"></i>
              </button>
              <button className="btn btn-light btn-icon">
                <i className="bi bi-gear-fill"></i>
              </button>
              <button className="btn btn-light btn-icon" onClick={logout} title="Sign Out">
                <i className="bi bi-arrow-right-square-fill"></i>
              </button>
            </>
          ) : (
            <>
              {/* Show logged-out buttons */}
              <Link to="/auth">
                <button className="btn btn-light btn-icon" title="Sign In">
                  <i className="bi bi-arrow-left-square-fill"></i>
                </button>
              </Link>
              <Link to="/auth">
                <button className="btn btn-light btn-icon" title="Sign Up">
                  <i className="bi bi-plus-square-fill"></i>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
