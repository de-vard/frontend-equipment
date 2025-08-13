// components/EquipmentList.jsx
import React from "react";
import { Alert, ListGroup, Spinner, Card } from 'react-bootstrap';
import EquipmentItem from "./EquipmentItem";

function EquipmentList({ equipment, error, isLoading, onItemClick }) {
    if (isLoading) return <Spinner />;
    if (error) return <Alert variant="danger">Ошибка загрузки</Alert>;
    if (!equipment?.length) return <Alert variant="info">Нет оборудования</Alert>;



    return (
        <ListGroup>
            {equipment.map((e) => (
                <EquipmentItem
                    key={e.public_id}
                    equipment={e}
                    onClick={() => onItemClick(e.public_id)}
                />
            ))}
        </ListGroup>
    );
}

export default React.memo(EquipmentList);