// components/pages/TransferEquipmentPage.jsx
import React from "react";
import { Container } from "react-bootstrap";
import TransferEquipmentForm from "./TransferEquipmentForm";

function TransferEquipmentPage() {
    return (
        <Container>
            <h1 className="my-4">Передача оборудования</h1>
            <TransferEquipmentForm 
                show={true} 
                onHide={() => window.history.back()} 
            />
        </Container>
    );
}

export default TransferEquipmentPage;