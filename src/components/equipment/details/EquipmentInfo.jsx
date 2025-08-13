import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Modal, Button } from "react-bootstrap";

const EquipmentInfo = ({ equipment }) => {
    const [showQRModal, setShowQRModal] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="card h-100">
                <div className="card-header bg-light p-2 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Основная информация</h6>
                    {equipment.serial_number && (
                        <div 
                            style={{ width: 30, height: 30, cursor: "pointer" }}
                            onClick={() => setShowQRModal(true)}
                            title="Нажмите для увеличения"
                        >
                            <QRCode 
                                value={equipment.serial_number} 
                                size={30}
                                level="L"
                            />
                        </div>
                    )}
                </div>
                <div className="card-body p-2">
                    {equipment.photo && (
                        <img
                            src={equipment.photo}
                            alt="Оборудование"
                            className="img-fluid rounded mb-2"
                        />
                    )}

                    <table className="table table-sm table-borderless mb-0">
                        <tbody>
                            <tr>
                                <td width="40%"><small className="text-muted">Модель:</small></td>
                                <td><strong>{equipment.model}</strong></td>
                            </tr>
                            <tr>
                                <td><small className="text-muted">Производитель:</small></td>
                                <td>{equipment.manufacturer?.name || '-'}</td>
                            </tr>
                            <tr>
                                <td><small className="text-muted">Тип:</small></td>
                                <td>{equipment.type?.name || '-'}</td>
                            </tr>
                            <tr>
                                <td><small className="text-muted">Серийный №:</small></td>
                                <td>{equipment.serial_number || '-'}</td>
                            </tr>
                            <tr>
                                <td><small className="text-muted">Владелец:</small></td>
                                <td>{equipment.current_owner?.username || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Модальное окно для QR-кода */}
            <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>QR-код оборудования</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <QRCode 
                            value={equipment.serial_number} 
                            size={256}
                            level="H"
                        />
                    </div>
                    <p className="mb-1"><strong>Модель:</strong> {equipment.model}</p>
                    <p className="mb-1"><strong>Серийный номер:</strong> {equipment.serial_number}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQRModal(false)}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>
                        Печать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EquipmentInfo;