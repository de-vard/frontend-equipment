// components/MainNavLinks.jsx
import React from "react";
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";

function MainNavLinks() {
    return (
        <Nav className="me-auto">
            <Nav.Link as={Link} to="/equipment-list">
                Список всего оборудования
            </Nav.Link>
            <Nav.Link as={Link} to="/transfer-equipment/">
                Заявки на технику
            </Nav.Link>
            <Nav.Link as={Link} to="/transfer-list/">
                Информация по заявкам
            </Nav.Link>
        </Nav>
    );
}

export default MainNavLinks;