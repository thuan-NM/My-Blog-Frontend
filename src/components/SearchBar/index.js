import React from 'react';

function SearchBar({ searchTerm, setSearchTerm, handleSearch }){    
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
           handleSearch();
        }
    };
    return (
        
        <div className="search-bar">
            <form>
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}><i className="la la-search"></i></button>
            </form>
        </div>
)}  
export default SearchBar;