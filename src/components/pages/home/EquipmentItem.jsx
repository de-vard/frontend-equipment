import React from "react";
import { ListGroupItem, Badge } from 'react-bootstrap';


function EquipmentItem({ equipment, onClick }) {

    return (
        <ListGroupItem
            action
            onClick={onClick}
            className="light" text="dark"
        >
            <div className="d-flex justify-content-between align-items-start w-100 mb-2">
                <div>
                    <h6 className="mb-1 fw-bold">
                        {equipment.model}
                        {equipment.serial_number && (
                            <Badge bg="secondary" className="ms-2">
                                SN: {equipment.serial_number}
                            </Badge>
                        )}
                    </h6>
                    <div className="text-muted small">
                        <span className="me-2">
                            <i className="bi bi-tag-fill me-1"></i>
                            {equipment.type?.name || 'Тип не указан'}
                        </span>
                        <span>
                            <i className="bi bi-building me-1"></i>
                            {equipment.manufacturer?.name || 'Производитель не указан'}
                        </span>
                    </div>
                </div>
                <i className="bi bi-chevron-right text-muted mt-1"></i>
            </div>

            <div className="d-flex justify-content-between small text-muted">

                {equipment.current_owner && (
                    <div>
                        <i className="bi bi-person-circle me-1"></i>
                        {equipment.current_owner.first_name} {equipment.current_owner.last_name}
                    </div>
                )}
            </div>
        </ListGroupItem>
    );
}

export default React.memo(EquipmentItem);