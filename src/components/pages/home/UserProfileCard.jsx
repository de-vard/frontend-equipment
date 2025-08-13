// components/UserProfileCard.jsx
import React from "react";
import { Card, ListGroup } from 'react-bootstrap';

function UserProfileCard({ user }) {
    const fullName = `${user.last_name} ${user.first_name?.[0]}.${user.middle_name?.[0]}.`;
    const position = typeof user.position === 'object' ? user.position?.name : `Position ID: ${user.position}`;

    return (
        <Card bg="light" text="dark" className="shadow-sm">
            <Card.Body className="p-3">
                <h4 className="mb-3 fw-normal">{fullName}</h4>
                <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 px-0 py-2">
                        <i className="bi bi-envelope text-muted me-2"></i>
                        <span className="text-muted">{user.email}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 px-0 py-2">
                        <i className="bi bi-briefcase text-muted me-2"></i>
                        <span className="text-muted">{position}</span>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default React.memo(UserProfileCard);