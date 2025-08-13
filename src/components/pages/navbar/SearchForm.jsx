// components/SearchForm.jsx
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SearchForm({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <Form className="d-flex me-2" onSubmit={handleSubmit}>
            <Form.Control
                type="search"
                placeholder="Поиск техники..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">Поиск</Button>
        </Form>
    );
}

export default SearchForm;