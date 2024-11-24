// fe/src/components/LocationAutocomplete.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { FaSearchLocation } from 'react-icons/fa';

const LocationAutocomplete = ({ value, onChange }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const wrapperRef = useRef(null);

    // Đóng danh sách gợi ý khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hàm debounce để giảm số lần gọi API
    const fetchSuggestions = useRef(
        debounce(async (query) => {
            if (!query) {
                setSuggestions([]);
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                    {
                        params: {
                            access_token: process.env.GEOCODING_API_KEY,
                            autocomplete: true,
                            limit: 3,
                            language: 'vi', // Đặt ngôn ngữ trả về là tiếng Việt
                        },
                    }
                );
                setSuggestions(response.data.features);
                setError(null);
            } catch (err) {
                console.error('Error fetching location suggestions:', err);
                setError('Không thể tải gợi ý địa chỉ.');
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 500)
    ).current;

    useEffect(() => {
        setLoading(true);
        fetchSuggestions(value);
    }, [value, fetchSuggestions]);

    const handleInputChange = (e) => {
        onChange(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (place) => {
        onChange(place.place_name);
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                placeholder="Nhập tên khu vực"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearchLocation className="absolute right-3 top-3 text-gray-400" />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {suggestion.place_name}
                        </li>
                    ))}
                </ul>
            )}
            {loading && (
                <div className="absolute right-3 top-3">
                    <span className="text-sm text-gray-500">Loading...</span>
                </div>
            )}
            {error && (
                <div className="absolute w-full bg-red-100 text-red-700 p-2 rounded-md mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete;
