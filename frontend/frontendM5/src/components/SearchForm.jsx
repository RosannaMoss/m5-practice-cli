import React, { useState } from "react";
import axios from "axios";
import styles from "./SearchForm.module.css";

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
    <div className={styles.searchContainer}>
      <h1 className={styles.heading}>KIA ORA! READY TO FIND YOUR NEW?</h1>
      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search all of Trade Me"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      <nav className={styles.categoryNav}>
        <a href="#" className={`${styles.categoryLink} ${styles.marketplace}`}>Marketplace</a>
        <a href="#" className={`${styles.categoryLink} ${styles.jobs}`}>Jobs</a>
        <a href="#" className={`${styles.categoryLink} ${styles.motors}`}>Motors</a>
        <a href="#" className={`${styles.categoryLink} ${styles.property}`}>Property</a>
        <a href="#" className={`${styles.categoryLink} ${styles.services}`}>Services</a>
      </nav>

      {results.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2 className={styles.resultsTitle}>Results:</h2>
          <ul className={styles.resultsList}>
            {results.map((item) => (
              <li key={item._id} className={styles.resultItem}>
                <div className={styles.resultTitle}>
                  <strong>{item.title}</strong>
                </div>
                <div className={styles.resultDescription}>{item.description}</div>
                <div className={styles.resultPrice}>
                  Start Price: ${item.start_price} | Reserve Price: ${item.reserve_price}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasSearched && results.length === 0 && (
        <div className={styles.noResults}>No items found</div>
      )}
    </div>
  );
};

export default SearchForm;
