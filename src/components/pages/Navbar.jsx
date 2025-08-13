// components/NavigationBar.jsx
import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import { getUser, useUserActions } from "../../hooks/user.actions";
import SearchForm from "./navbar/SearchForm";
import UserDropdown from "./navbar/UserDropdown";
import MainNavLinks from "./navbar/MainNavLinks";

// components/NavigationBar.jsx
function NavigationBar() {
  const navigate = useNavigate();
  const userActions = useUserActions();
  const user = getUser();

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    userActions.logout();
    navigate("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">Учет техники</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <MainNavLinks />
          
          <Nav>
            <SearchForm onSearch={handleSearch} />
            
            {user ? (
              <UserDropdown user={user} handleLogout={handleLogout} />
            ) : (
              <Nav.Link as={Link} to="/login">Вход</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;