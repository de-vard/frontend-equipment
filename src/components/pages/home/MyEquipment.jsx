// pages/MyEquipment.jsx
import React from "react";
import { useNavigate } from "react-router-dom";


import useSWR from 'swr';
import { Container, Row, Col } from 'react-bootstrap';
import UserProfileCard from "./UserProfileCard";

import axiosService from "../../../helpers/axios";
import { getUser } from "../../../hooks/user.actions";
import EquipmentList from "./EquipmentList";

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
    const equipmentList = equipment?.results || [];


    return (
        <Container className="my-4">
            <Row>
                <Col md={4}>
                    <UserProfileCard user={user} />
                </Col>

                <Col md={8}>
                    <EquipmentList 
                    equipment={equipmentList} 
                    error={error} 
                    isLoading={isLoading} 
                    onItemClick={handleEquipmentClick}
                        
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default MyEquipment;