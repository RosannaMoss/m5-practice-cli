import React, { useState } from "react";
import axios from "axios";
import "./SearchForm.css";

const SearchForm = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?keyword=${keyword}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <h1>KIA ORA! READY TO FIND YOUR NEW?</h1>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search all of Trade Me"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <nav className="category-nav">
        <a href="#" className="category-link marketplace">Marketplace</a>
        <a href="#" className="category-link jobs">Jobs</a>
        <a href="#" className="category-link motors">Motors</a>
        <a href="#" className="category-link property">Property</a>
        <a href="#" className="category-link services">Services</a>
      </nav>

      {results.length > 0 && (
        <div className="results-container">
          <h2 className="results-title">Results:</h2>
          <ul className="results-list">
            {results.map((item) => (
              <li key={item._id} className="result-item">
                <div className="result-title">
                  <strong>{item.title}</strong>
                </div>
                <div>{item.description}</div>
                <div className="result-price">
                  Start Price: ${item.start_price} | Reserve Price: ${item.reserve_price}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasSearched && results.length === 0 && (
        <div className="no-results">No items found</div>
      )}
    </div>
  );
};

export default SearchForm;
