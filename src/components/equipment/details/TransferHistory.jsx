import React from "react";
import TransferItem from "./TransferItem";

function TransferHistory({ transfers = [] }) {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                <h5 className="mb-0 text-dark">История перемещений</h5>
                <span className="badge bg-dark text-white">{transfers.length}</span>
            </div>
            
            <div className="card-body p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {transfers.length === 0 ? (
                    <div className="alert alert-info m-3">Нет записей о перемещениях</div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {transfers.map(transfer => (
                            <TransferItem 
                                key={transfer.public_id || transfer.id} 
                                transfer={transfer} 
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TransferHistory;