// components/equipment/TransferEquipmentForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axiosService from '../../helpers/axios';

function TransferEquipmentForm({ show, onHide }) {
    const [equipmentList, setEquipmentList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');




    useEffect(() => {
        if (show) {
            fetchUserEquipment();
            fetchOrganizationUsers();
        }
    }, [show]);

    const fetchUserEquipment = async () => {
        try {
            const response = await axiosService.get('/equip/my-without-poisoned/');
            console.log(response.data); // для отладки
            // Используем response.data.results вместо response.data
            setEquipmentList(response.data?.results || []);
        } catch (err) {
            console.error('Ошибка загрузки оборудования:', err);
            setError('Не удалось загрузить ваше оборудование');
            setEquipmentList([]);
        }
    };

    const fetchOrganizationUsers = async () => {
        try {
            const response = await axiosService.get('/users/organization/');
            // Используем response.data.results если есть, иначе response.data
            setUsersList(response.data?.results || response.data || []);
        } catch (err) {
            console.error('Ошибка загрузки пользователей:', err);
            setError('Не удалось загрузить список пользователей');
            setUsersList([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const transferData = {
                equipment: selectedEquipment,
                receiver: selectedUser,
                comment: comment,

            };

            await axiosService.post('/transfer/create/', transferData);
            setSuccess('Заявка на передачу успешно создана!');
            setTimeout(() => {
                onHide();
                resetForm();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка при создании заявки');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedEquipment('');
        setSelectedUser('');
        setComment('');
        setSuccess('');
    };


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Создать заявку на передачу оборудования</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEquipment">
                            <Form.Label>Оборудование *</Form.Label>
                            <Form.Select
                                value={selectedEquipment}
                                onChange={(e) => setSelectedEquipment(e.target.value)}
                                required
                            >
                                <option value="">Выберите оборудование</option>
                                {equipmentList.map((item) => (
                                    <option key={item.public_id} value={item.public_id}>
                                        {item.type.name} {item.manufacturer.name} {item.model}
                                        (Сер. №: {item.serial_number || 'не указан'})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formUser">
                            <Form.Label>Получатель *</Form.Label>
                            <Form.Select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
                            >
                                <option value="">Выберите получателя</option>
                                {usersList.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.last_name} {user.first_name} {user.middle_name}
                                        {user.position && ` (${user.position.name})`}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formComment">
                        <Form.Label>Комментарий</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Укажите причину передачи оборудования"
                        />
                    </Form.Group>


                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-2">Отправка...</span>
                                </>
                            ) : 'Создать заявку'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default TransferEquipmentForm;