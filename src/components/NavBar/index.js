import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function NavBar() {
  const imagePath = process.env.PUBLIC_URL + '/images/logo.png';
  const { user, logout } = useAuth();
  const storedToken = localStorage.getItem('token');
  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid d-flex justify-content-bettween">
        <div className="d-flex">
          <Link className="nav-link" to="/"><button className="btn btn-light btn-icon" title="Home"><i className="bi bi-house-fill"></i></button></Link>
          <div>
            {(storedToken != null) && (
              <div>
                <Link to="/friends"><button className="btn btn-light btn-icon" title="Friends"><i className="bi bi-people-fill"></i></button></Link>
                <Link to="/myprofile"><button className="btn btn-light btn-icon" title="My Profile"><i className="bi bi-person-fill"></i></button></Link>
              </div>
            )}
          </div>
        </div>
        <div><Link to="/" className="blog-name"><img className="blog-img" src={imagePath} alt="Meow Blog" /></Link></div>
        <div className="d-flex">
          {(storedToken != null) ? (
            // Nếu người dùng đã đăng nhập, hiển thị nút Sign Out
            <div>
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
            </div>
          ) : (
            // Nếu chưa đăng nhập, hiển thị nút Sign In và Sign Up
            <div>
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
