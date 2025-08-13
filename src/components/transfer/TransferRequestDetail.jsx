// components/transfer/TransferRequestDetail.jsx
import React, { useState, useEffect } from 'react';
import {
    Card, Alert, Spinner, Badge, Row, Col, Container,
    Button, Modal, Form
} from 'react-bootstrap';
import axiosService from '../../helpers/axios';
import { useParams } from 'react-router-dom';
import NavigationBar from '../../components/pages/Navbar';
import { getUser } from '../../hooks/user.actions';

function TransferRequestDetail() {
    const { public_id } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(null);
    const [otpCode, setOtpCode] = useState('');
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        if (public_id) {
            fetchRequest();
        }
    }, [public_id]);

    const fetchRequest = async () => {
        setLoading(true);
        try {
            const response = await axiosService.get(`/transfer/requests/${public_id}/`);
            setRequest(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка при загрузке заявки');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (actionType) => {
        setAction(actionType);
        setShowModal(true);
        setModalError('');
    };

    const handleSubmitAction = async () => {
        if (!otpCode) {
            setModalError('Введите код двухфакторной аутентификации');
            return;
        }

        setProcessing(true);
        setModalError('');

        try {
            const data = {
                status: action,
                otp_code: otpCode,
                ...(comment && { comment })
            };

            await axiosService.patch(`/transfer/update/${public_id}/`, data);
            fetchRequest(); // Обновляем данные после успешного действия
            setShowModal(false);
            setOtpCode('');
            setComment('');
        } catch (err) {
            setModalError(err.response?.data?.otp_code ||
                err.response?.data?.status ||
                'Ошибка при обработке запроса');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            accepted: 'success',
            rejected: 'danger'
        };
        return <Badge bg={variants[status]} className="text-capitalize">{status}</Badge>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const currentUser = getUser();
    const isReceiver = currentUser?.id === request?.receiver?.id;


    return (
        <>
            <NavigationBar />
            <Container className="my-4">
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </Spinner>
                    </div>
                ) : request ? (
                    <>
                        <Card className="shadow-sm mb-4">
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Заявка на передачу оборудования {getStatusBadge(request.status)}</h4>
                                {isReceiver && request.status === 'pending' && (
                                    <div>
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={() => handleActionClick('accepted')}
                                        >
                                            Принять
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleActionClick('rejected')}
                                        >
                                            Отклонить
                                        </Button>
                                    </div>
                                )}
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Card className="h-100">
                                            <Card.Header className="bg-light">
                                                <h5 className="mb-0">Оборудование</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                {request.equipment.photo && (
                                                    <div className="text-center mb-3">
                                                        <img
                                                            src={request.equipment.photo}
                                                            alt="Оборудование"
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                                <p><strong>Тип:</strong> {request.equipment.type?.name || 'Не указано'}</p>
                                                <p><strong>Инв. №:</strong> {request.equipment?.inventory_number || 'Не указан'}</p>
                                                <p><strong>Серийный №:</strong> {request.equipment?.serial_number || 'Не указан'}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6}>
                                        <Card className="h-100">
                                            <Card.Header className="bg-light">
                                                <h5 className="mb-0">Участники</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="mb-3">
                                                    <h6>Отправитель</h6>
                                                    <p className="mb-1">
                                                        {request.sender?.last_name} {request.sender?.first_name}
                                                    </p>
                                                    {request.sender?.position && (
                                                        <p className="text-muted small">{request.sender.position.name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <h6>Получатель</h6>
                                                    <p className="mb-1">
                                                        {request.receiver?.last_name} {request.receiver?.first_name}
                                                    </p>
                                                    {request.receiver?.position && (
                                                        <p className="text-muted small">{request.receiver.position.name}</p>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Header className="bg-light">
                                                <h5 className="mb-0">Даты</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <p><strong>Запрошено:</strong> {formatDate(request.requested_at)}</p>
                                                {request.accepted_at && (
                                                    <p><strong>Обновлено:</strong> {formatDate(request.accepted_at)}</p>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {request.comment && (
                                        <Col md={6}>
                                            <Card>
                                                <Card.Header className="bg-light">
                                                    <h5 className="mb-0">Комментарий</h5>
                                                </Card.Header>
                                                <Card.Body>
                                                    <p className="text-break">{request.comment}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Модальное окно подтверждения */}
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {action === 'accepted' ? 'Подтверждение принятия' : 'Подтверждение отклонения'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modalError && <Alert variant="danger">{modalError}</Alert>}

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Код двухфакторной аутентификации
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="Введите код из приложения"
                                    />
                                </Form.Group>



                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowModal(false)}
                                        disabled={processing}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant={action === 'accepted' ? 'success' : 'danger'}
                                        onClick={handleSubmitAction}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-1"
                                                />
                                                Обработка...
                                            </>
                                        ) : (
                                            action === 'accepted' ? 'Подтвердить принятие' : 'Подтвердить отклонение'
                                        )}
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
                ) : (
                    !error && <Alert variant="info" className="mt-4">Заявка не найдена</Alert>
                )}
            </Container>
        </>
    );
}

export default TransferRequestDetail;