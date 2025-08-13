import React, { useState } from "react";
import { 
  Spinner, Alert, Card, ListGroup, Button, 
  Container, Row, Col, Image, Pagination 
} from 'react-bootstrap';
import NavigationBar from "../pages/Navbar";
import useSWR from 'swr';
import axiosService from "../../helpers/axios";
import { useNavigate } from "react-router-dom";

function EquipmentList() {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState('serial_number');
    const [sortOrder, setSortOrder] = useState('asc');
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    const { data, error, isLoading } = useSWR(
        `http://127.0.0.1:8000/api/v1/equipment/?ordering=${sortOrder === 'asc' ? '' : '-'}${sortField}&limit=${limit}&offset=${offset}`,
        (url) => axiosService.get(url).then(res => res.data)
    );
    
    const handleSort = (field) => {
        if (sortField === field) {
            // Если уже сортируем по этому полю, меняем порядок
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Если новое поле, сортируем по возрастанию
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const handleRowClick = (publicId) => {
        navigate(`/equipment/${publicId}`);
    };

    // получает получает файлик с экселем всего оборудования
    const handleExport = async () => {
        try {
            const response = await axiosService.get('/equip/export/', {
                responseType: 'blob'
            });

            // Создаем ссылку для скачивания
            const downloadUrl = URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'equipment_list.xlsx';
            a.click();
            URL.revokeObjectURL(downloadUrl); // Освобождаем память
        } catch (error) {
            console.error('Export failed:', error);
            alert('Ошибка при экспорте. Проверьте авторизацию.');
        }
    };



        // Обработчик изменения страницы
    const handlePageChange = (newOffset) => {
        setOffset(newOffset);
    };

    // Обработчик изменения количества элементов на странице
    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setOffset(0); // Сбрасываем смещение при изменении лимита
    };

    // Рассчитываем общее количество страниц
    const totalPages = data?.count ? Math.ceil(data.count / limit) : 0;
    const currentPage = Math.floor(offset / limit) + 1;


    return (
        <div>
            <NavigationBar />
            <Container className="mt-4">
                {isLoading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="mt-3">
                        Ошибка при загрузке данных: {error.message}
                    </Alert>
                ) : !data?.results?.length ? (
                    <Card className="shadow-sm mt-3">
                        <Card.Body className="text-center py-4">
                            <i className="bi bi-box-seam display-4 text-muted mb-3"></i>
                            <h4>Нет оборудования</h4>
                            <p className="text-muted">В системе не найдено ни одного оборудования</p>
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <Row className="mb-4">
                            <Col>
                                <h2>Список оборудования</h2>
                                <p className="text-muted small">Всего: {data.count} единиц</p>
                            </Col>
                            <Col className="text-end">
                                <Button variant="success" onClick={handleExport}>
                                    <i className="bi bi-file-excel me-2"></i>
                                    Скачать в Excel
                                </Button>
                            </Col>
                        </Row>

                        <Card className="shadow-sm">
                            <Card.Header className="bg-light">
                                <Row>
                                    <Col md={2} className="fw-bold">Фото</Col>
                                    <Col md={2} className="fw-bold" onClick={() => handleSort('serial_number')} style={{ cursor: 'pointer' }}>
                                        Серийный номер <SortIcon field="serial_number" />
                                    </Col>
                                    <Col md={2} className="fw-bold" onClick={() => handleSort('model')} style={{ cursor: 'pointer' }}>
                                        Модель <SortIcon field="model" />
                                    </Col>
                                    <Col md={2} className="fw-bold" onClick={() => handleSort('type__name')} style={{ cursor: 'pointer' }}>
                                        Тип <SortIcon field="type__name" />
                                    </Col>
                                    <Col md={2} className="fw-bold" onClick={() => handleSort('manufacturer__name')} style={{ cursor: 'pointer' }}>
                                        Производитель <SortIcon field="manufacturer__name" />
                                    </Col>
                                    <Col md={2} className="fw-bold" onClick={() => handleSort('current_owner__username')} style={{ cursor: 'pointer' }}>
                                        Владелец <SortIcon field="current_owner__username" />
                                    </Col>
                                </Row>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {data.results.map((item) => (
                                    <ListGroup.Item
                                        key={item.public_id}
                                        action
                                        onClick={() => handleRowClick(item.public_id)}
                                        style={{ cursor: 'pointer' }}
                                        className="hover-effect"
                                    >
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                {item.photo ? (
                                                    <Image
                                                        src={item.photo}
                                                        alt={item.model}
                                                        rounded
                                                        thumbnail
                                                        className="border-0 equipment-image"
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="bg-light d-flex justify-content-center align-items-center rounded"
                                                        style={{
                                                            width: '80px',
                                                            height: '80px'
                                                        }}>
                                                        <i className="bi bi-image text-muted fs-3"></i>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col md={2}>{item.serial_number || '-'}</Col>
                                            <Col md={2}>{item.model || '-'}</Col>
                                            <Col md={2}>{item.type?.name || '-'}</Col>
                                            <Col md={2}>{item.manufacturer?.name || '-'}</Col>
                                            <Col md={2}>{item.current_owner?.username || '-'}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            {/* Добавляем пагинацию после списка оборудования */}
                {data?.count > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2">Элементов на странице:</span>
                            <select 
                                className="form-select form-select-sm" 
                                style={{ width: '70px' }}
                                value={limit}
                                onChange={handleLimitChange}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        
                        <Pagination>
                            <Pagination.First 
                                onClick={() => handlePageChange(0)} 
                                disabled={offset === 0}
                            />
                            <Pagination.Prev 
                                onClick={() => handlePageChange(Math.max(0, offset - limit))} 
                                disabled={offset === 0}
                            />
                            
                            {/* Показываем номера страниц */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = Math.max(1, Math.min(
                                    totalPages - 4, 
                                    currentPage - 2
                                )) + i;
                                if (page < 1 || page > totalPages) return null;
                                
                                return (
                                    <Pagination.Item
                                        key={page}
                                        active={page === currentPage}
                                        onClick={() => handlePageChange((page - 1) * limit)}
                                    >
                                        {page}
                                    </Pagination.Item>
                                );
                            })}
                            
                            <Pagination.Next 
                                onClick={() => handlePageChange(offset + limit)} 
                                disabled={offset + limit >= (data?.count || 0)}
                            />
                            <Pagination.Last 
                                onClick={() => handlePageChange((totalPages - 1) * limit)} 
                                disabled={offset + limit >= (data?.count || 0)}
                            />
                        </Pagination>
                        
                        <div>
                            Показано {offset + 1}-{Math.min(offset + limit, data?.count)} из {data?.count}
                        </div>
                    </div>
                )}
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
}

export default EquipmentList;