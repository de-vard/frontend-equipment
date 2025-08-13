import React from "react";

const TransferItem = ({ transfer }) => {
    // Функция для форматирования даты
    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString; // Возвращаем оригинальную строку, если не удалось распарсить
        }
    };

    return (
        <li className="list-group-item p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <div className="fw-bold text-dark mb-1">
                        {transfer.receiver?.username || 'Неизвестный получатель'}
                    </div>
                    <div className="text-muted small">
                        <span>От: {transfer.sender?.username || 'Неизвестный отправитель'}</span>
                    </div>
                </div>

                <div className="text-end">
                    <div className={`badge ${transfer.status === 'accepted' ? 'bg-success' :
                        transfer.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                        {transfer.status === 'accepted' ? 'Принято' :
                            transfer.status === 'rejected' ? 'Отклонено' : 'В обработке'}
                    </div>
                    <div className="text-muted small mt-1">
                        {formatDate(transfer.requested_at)}
                    </div>
                </div>
            </div>

            {transfer.comment && (
                <div className="bg-light p-2 rounded mt-2">
                    <div className="fw-semibold small text-secondary">Комментарий:</div>
                    <div className="small">{transfer.comment}</div>
                </div>
            )}
        </li>
    );
};

export default TransferItem;