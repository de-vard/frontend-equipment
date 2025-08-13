// pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosService from "../../helpers/axios";
import EquipmentSearchResults from "./EquipmentSearchResults";
import NavigationBar from "./Navbar";

function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (searchTerm) {
            fetchSearchResults(searchTerm);
        }
    }, [searchTerm]);

    const fetchSearchResults = async (term) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosService.get(`http://127.0.0.1:8000/api/v1/equipment/?search=${encodeURIComponent(term)}`);
            setResults(response.data.results || response.data);

        } catch (err) {
            setError(err.response?.data?.message || "Ошибка при выполнении поиска");
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
        <NavigationBar/>
            <h2>Результаты поиска: "{searchTerm}"</h2>
            <EquipmentSearchResults
                results={results}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default SearchPage;