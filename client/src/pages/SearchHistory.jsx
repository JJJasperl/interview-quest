// client/src/pages/SearchHistory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecentSearches,
  getDisplayTitle,
  removeSearch,
} from "../utils/cache";

function SearchHistory() {
  const [searches, setSearches] = useState(getRecentSearches());
  const navigate = useNavigate();

  const handleDelete = (searchId) => {
    const updatedSearches = removeSearch(searchId);
    setSearches(updatedSearches);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Date unavailable";
    }
  };

  const handleSelectSearch = (search) => {
    // Navigate back to main page with the selected search
    navigate("/", { state: { selectedSearch: search } });
  };

  return (
    <div className="search-history-page">
      <div className="search-history-header">
        <h1>Search History</h1>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Generator
        </button>
      </div>

      {searches.length === 0 ? (
        <div className="no-history">
          <p>No search history found.</p>
        </div>
      ) : (
        <div className="history-list">
          {searches.map((search) => (
            <div key={search.id} className="history-item">
              <div
                className="history-item-content"
                onClick={() => handleSelectSearch(search)}
              >
                <div className="history-item-title">
                  {getDisplayTitle(search)}
                </div>
                <div className="history-item-date">
                  {search.timestamp
                    ? formatDate(search.timestamp)
                    : "Date unavailable"}
                </div>
                <div className="history-item-preview">
                  {search.jobPost.substring(0, 150)}...
                </div>
              </div>
              <button
                className="history-item-delete"
                onClick={() => handleDelete(search.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchHistory;
