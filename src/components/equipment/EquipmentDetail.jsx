import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from 'swr';
import { Spinner } from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import { Container, Row, Col } from 'react-bootstrap';


import EquipmentInfo from "./details/EquipmentInfo";
import TransferHistory from "./details/TransferHistory";
import NavigationBar from "../../components/pages/Navbar";

function EquipmentDetail() {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(
        `http://127.0.0.1:8000/api/v1/equip/history/${id}/`,
        (url) => axiosService.get(url).then(res => res.data)
    );

    if (isLoading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <div className="alert alert-danger mt-3">Ошибка загрузки</div>;
    if (!data) return <div className="alert alert-warning mt-3">Нет данных</div>;

    console.log(data);
    return (
        <Container className="my-4">
            <NavigationBar />
            <br/>
            <br/>
            <Row>
                <Col lg={4}>
                    <EquipmentInfo equipment={data} />
                </Col>
                <Col lg={8}>
                    <TransferHistory transfers={data.transfer_history} />
                </Col>
            </Row>
        </Container>
    );

}

export default EquipmentDetail;