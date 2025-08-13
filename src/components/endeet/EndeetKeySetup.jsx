// components/endeet/EndeetKeySetup.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Image } from 'react-bootstrap';
import axiosService from '../../helpers/axios';

function EndeetKeySetup({ show, onHide }) {
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            fetchQrCode();
        }
    }, [show]);

    const fetchQrCode = async () => {
        try {
            const response = await axiosService.get('/auth/endeet-key/');
            setQrCode(response.data.qr_code);
            setSecret(response.data.secret);
            setError('');
        } catch (err) {
            setError('Не удалось получить QR-код. Попробуйте позже.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axiosService.post('/auth/endeet-key/', { code });
            setSuccess('Endeet Key успешно привязан к вашему аккаунту!');
            setTimeout(() => onHide(), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Неверный код подтверждения. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Настройка Endeet Key</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <p>1. Отсканируйте QR-код в приложении для 2FA (Google Authenticator, Microsoft Authenticator и т.д.)</p>
                
                {qrCode && (
                    <div className="text-center mb-3">
                        <Image 
                            src={`data:image/png;base64,${qrCode}`} 
                            alt="QR Code" 
                            fluid 
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                )}

                <p>2. Введите код подтверждения из приложения:</p>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="6-значный код"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Проверка...' : 'Подтвердить'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EndeetKeySetup;