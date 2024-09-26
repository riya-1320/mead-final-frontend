import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <i className="fa-solid fa-bars"></i>
        )}
      </button>

      {/* Dashboard Heading */}
     <div>
     <div className="sidebar-heading">
        <h2>Dashboard</h2>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard/quotation"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Users
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/dashboard/reports"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Settings
            </NavLink>
          </li> */}
        </ul>
      </nav>
     </div>
     <div className='logout'>
      <NavLink to="/login" className="logout-btn" onClick={logout}>Logout</NavLink>
     </div>

    </div>
  );
};

export default Sidebar;
