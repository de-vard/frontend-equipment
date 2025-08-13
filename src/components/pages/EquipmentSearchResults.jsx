import React from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function EquipmentSearchResults({ results, loading, error }) {
    const navigate = useNavigate();

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!results || results.length === 0) return <Alert variant="info">Ничего не найдено</Alert>;

    console.log(results);
    return (
        <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
                <tr>
                    <th>Серийный номер</th>
                    <th>Модель</th>
                    <th>Тип</th>
                    <th>Производитель</th>
                    <th>Владелец</th>
                </tr>
            </thead>
            <tbody>
                {results.map((equipment) => (
                    <tr 
                        key={equipment.id}
                        onClick={() => navigate(`/equipment/${equipment.public_id}`)}
                        style={{ cursor: 'pointer' }}
                        className="table-row-hover"
                    >
                        <td>{equipment.serial_number}</td>
                        <td>{equipment.model}</td>
                        <td>{equipment.type?.name || '-'}</td>
                        <td>{equipment.manufacturer?.name || '-'}</td>
                        <td>{equipment.current_owner?.username || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default EquipmentSearchResults;