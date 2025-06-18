import React, { useState } from 'react';
import './Navbar.css';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">SmartPantry</div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li onClick={() => setMenuOpen(false)}>
            <Link to="/">Dashboard</Link>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <Link to="/shopping-list">Shopping List</Link>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <Link to="/profile">Profile</Link>
          </li>
          <li> {isLoggedIn && <button  onClick={handleLogout}>Logout</button>}</li>
          <li className="notification" onClick={() => setMenuOpen(false)}>
            <Link to="/notifications">
              <FaBell />
              <span className="badge"></span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
