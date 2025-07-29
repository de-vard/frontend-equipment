import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";
import useSWR from 'swr';
import { Spinner, Alert, Card, ListGroup, Badge, Button } from 'react-bootstrap';



function EquipmentHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const { data: equipmentData, error, isLoading } = useSWR(
    `http://127.0.0.1:8000/api/v1/equip/history/${id}/`,
    (url) => axiosService.get(url).then(res => res.data),
    { 
      refreshInterval: 30000,
      revalidateOnFocus: false
    }
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        Ошибка при загрузке данных: {error.message}
      </Alert>
    );
  }

  if (!equipmentData) {
    return (
      <Alert variant="warning" className="mt-3">
        Нет данных об оборудовании
      </Alert>
    );
  }



  return (
    <div className="container mt-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        ← Назад
      </Button>

      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4>Информация об оборудовании</h4>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              {equipmentData.photo && (
                <img 
                  src={equipmentData.photo} 
                  alt="Фото оборудования" 
                  className="img-fluid rounded mb-3"
                />
              )}
            </div>
            <div className="col-md-8">
              <h5>{equipmentData.manufacturer.name} {equipmentData.model}</h5>
              <p className="text-muted">Тип: {equipmentData.type.name}</p>
              
              <div className="row">
                <div className="col-6">
                  <p><strong>Серийный номер:</strong> {equipmentData.serial_number}</p>
                  <p><strong>Инвертерный номер:</strong> {equipmentData.inverter_number || 'не указан'}</p>
                </div>
                <div className="col-6">
                  <p><strong>Текущий владелец:</strong> {equipmentData.current_owner.username}</p>
                  <p><strong>Юр. лицо:</strong> {equipmentData.legal_entity.name}</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>История перемещений</h4>
        </Card.Header>
        <Card.Body>
          {equipmentData.transfer_history?.length > 0 ? (
            <ListGroup variant="flush">
              {equipmentData.transfer_history.map((transfer, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>
                        {transfer.new_owner.username} 
                        <Badge bg="info" className="ms-2">
                          {transfer.new_owner.legal_entity.name}
                        </Badge>
                      </h5>
                      <p className="mb-1">
                        <strong>От:</strong> {transfer.previous_owner.username}
                      </p>

                    </div>
                    <Badge bg={transfer.status === 'approved' ? 'success' : 'warning'}>
                      {transfer.status === 'approved' ? 'Подтверждено' : 'В ожидании'}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">
              Нет записей о перемещениях этого оборудования
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default EquipmentHistory;