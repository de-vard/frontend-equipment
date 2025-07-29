import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";
import useSWR from 'swr';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';

function MyEquipment() {
    const user = getUser();
    const navigate = useNavigate();

    const { data: equipment, error, isLoading } = useSWR(
        "http://localhost:8000/api/v1/equip/my/", 
        (url) => axiosService.get(url).then(res => res.data),
        { refreshInterval: 30000 }
    );

    const handleEquipmentClick = (equipmentId) => {
        navigate(`/equipment/${equipmentId}`);
    };

    return (
        <Container className="my-4">
            <Row>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5>User Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <h4 className="mb-3">
                                {user.last_name} {user.first_name} {user.middle_name}
                            </h4>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <i className="bi bi-envelope me-2"></i>
                                    {user.email}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-briefcase me-2"></i>
                                    {user.position}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5>My Equipment</h5>
                        </Card.Header>
                        <Card.Body>
                            {isLoading && (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading equipment data...</p>
                                </div>
                            )}
                            
                            {error && (
                                <Alert variant="danger">
                                    <Alert.Heading>Error loading data</Alert.Heading>
                                    <p>{error.message}</p>
                                </Alert>
                            )}
                            
                            {!error && !isLoading && !equipment && (
                                <Alert variant="warning">
                                    No data found
                                </Alert>
                            )}
                            
                            {!error && !isLoading && equipment && (
                                <>
                                    {(!Array.isArray(equipment.results) && !Array.isArray(equipment)) ? (
                                        <Alert variant="danger">Invalid data format</Alert>
                                    ) : (
                                        <>
                                            {(equipment.results?.length === 0 || equipment.length === 0) ? (
                                                <Alert variant="info">No equipment found</Alert>
                                            ) : (
                                                <ListGroup variant="flush">
                                                    {(equipment.results || equipment).map(e => (
                                                        <ListGroup.Item 
                                                            key={e.public_id} 
                                                            className="mb-3 border rounded equipment-item"
                                                            action
                                                            onClick={() => handleEquipmentClick(e.public_id)}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <h5>
                                                                        {getSafe(e, 'type.name')} - {e.model || 'N/A'}
                                                                        <Badge bg="secondary" className="ms-2">
                                                                            {getSafe(e, 'legal_entity.name')}
                                                                        </Badge>
                                                                    </h5>
                                                                    <p className="mb-1">
                                                                        <strong>Manufacturer:</strong> {getSafe(e, 'manufacturer.name')}
                                                                    </p>
                                                                    <p className="mb-1">
                                                                        <strong>Serial Number:</strong> {e.serial_number || 'N/A'}
                                                                    </p>
                                                                    <p className="mb-0">
                                                                        <strong>Assigned to:</strong> {getSafe(e, 'current_owner.first_name')} {getSafe(e, 'current_owner.last_name')}
                                                                    </p>
                                                                </div>
                                                                <Badge bg="light" text="dark" className="border">
                                                                    ID: {e.public_id}
                                                                </Badge>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Helper function to safely get nested properties
function getSafe(obj, propertyPath, defaultValue = "N/A") {
    return propertyPath.split('.').reduce(
        (o, p) => (o && o[p] !== undefined ? o[p] : defaultValue),
        obj
    );
}

export default MyEquipment;