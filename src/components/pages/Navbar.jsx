import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom";
import { getUser, useUserActions } from "../../hooks/user.actions";

function NavigationBar() {
  const navigate = useNavigate();
  const userActions = useUserActions();
  const user = getUser();

  const handleLogout = () => {
    userActions.logout();
    // Можно добавить дополнительную логику перед выходом если нужно
    navigate("/login"); // Перенаправляем на страницу входа
  };
 
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">Учет техники</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/equipment-list">
              Список всего оборудования
            </Nav.Link>
            <Nav.Link as={Link} to="/applications_equipment">
              Заявки на технику
            </Nav.Link>
          </Nav>

          <Nav>
            <Form className="d-flex me-2">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>

            {user ? (
              <NavDropdown 
                title={`${user.last_name} ${user.first_name[0]}.${user.middle_name[0]}.`}
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                 Endeet Key
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Выход
                </NavDropdown.Item>
              </NavDropdown>
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