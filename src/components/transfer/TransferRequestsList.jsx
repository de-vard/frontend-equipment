// components/transfer/TransferRequestsList.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Table, Alert, Spinner, Button } from 'react-bootstrap';
import axiosService from '../../helpers/axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/pages/Navbar';

function TransferRequestsList() {
    const [activeTab, setActiveTab] = useState('incoming');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests(activeTab);
    }, [activeTab]);

    const fetchRequests = async (type) => {
        setLoading(true);
        setError('');
        try {
            let endpoint = '';
            switch (type) {
                case 'incoming':
                    endpoint = '/transfer/incoming/';
                    break;
                case 'pending-incoming':
                    endpoint = '/transfer/pending-incoming/';
                    break;
                case 'outgoing':
                    endpoint = '/transfer/outgoing/';
                    break;
                case 'pending-outgoing':
                    endpoint = '/transfer/pending-outgoing/';
                    break;
                default:
                    endpoint = '/transfer/incoming/';
            }

            const response = await axiosService.get(endpoint);
            setRequests(response.data.results || response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка при загрузке заявок');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (public_id) => {
        navigate(`/transfer-request/${public_id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            accepted: 'success',
            rejected: 'danger'
        };
        return <span className={`badge bg-${variants[status]}`}>{status}</span>;
    };
    console.log(requests)
    return (
        <div>
            <NavigationBar />
            <div className="container mt-4">

                <h2 className="mb-4">Информация по заявкам</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                >

                    <Tab eventKey="pending-incoming" title="Приходящие">
                        {/* Ожидающие входящие */}
                    </Tab>
                    <Tab eventKey="pending-outgoing" title="Ожидают согласования">
                        {/* Ожидающие исходящие */}
                    </Tab>
                    <Tab eventKey="incoming" title="Архив входящих заявок ">
                        {/* Входящие заявки */}
                    </Tab>
                    <Tab eventKey="outgoing" title="Архив исходящих заявок">
                        {/* Исходящие заявки */}
                    </Tab>
                </Tabs>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>                
                                <th>Оборудование</th>
                                <th>Отправитель</th>
                                <th>Получатель</th>
                                <th>Статус</th>
                                <th>Дата запроса</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.equipment.type?.name || 'Не указано'}</td>
                                        <td>{request.sender?.last_name || 'Не указан'} {request.sender?.first_name}</td>
                                        <td>{request.receiver?.last_name || 'Не указан'} {request.receiver?.first_name}</td>
                                        <td>{getStatusBadge(request.status)}</td>
                                        <td>{formatDate(request.requested_at)}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => handleViewDetails(request.public_id)}
                                            >
                                                Подробнее
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Нет заявок</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div></div>
    );
}

export default TransferRequestsList;