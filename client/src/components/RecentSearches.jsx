// client/src/components/RecentSearches.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getRecentSearches,
  getDisplayTitle,
  removeSearch,
} from "../utils/cache";

function RecentSearches({ onSelectSearch, searchUpdateTrigger }) {
  // searchUpdateTrigger is a prop that changes when a new search is saved
  const [searches, setSearches] = useState(getRecentSearches());
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Date unavailable";
    }
  };
  // Refresh searches when the searchUpdateTrigger changes
  useEffect(() => {
    setSearches(getRecentSearches());
  }, [searchUpdateTrigger]);

  const handleDelete = (e, searchId) => {
    e.stopPropagation(); // Prevent triggering the card click
    const updatedSearches = removeSearch(searchId);
    setSearches(updatedSearches);
  };

  if (searches.length === 0) {
    return null;
  }

  // Only show 5 most recent searches in the main interface
  const visibleSearches = searches.slice(0, 5);
  const hasMoreSearches = searches.length > 5;

  return (
    <div className="recent-searches">
      <div className="recent-searches-header">
        <h2>Recent Searches</h2>
        {hasMoreSearches && (
          <Link to="/history" className="view-all-link">
            View All History
          </Link>
        )}
      </div>

      <div className="search-cards">
        {visibleSearches.map((search) => (
          <div
            key={search.id}
            className="search-card"
            onClick={() => onSelectSearch(search)}
          >
            <div className="search-card-header">
              <div className="search-card-title">{getDisplayTitle(search)}</div>
              <button
                className="search-card-delete"
                onClick={(e) => handleDelete(e, search.id)}
                aria-label="Delete search"
              >
                ×
              </button>
            </div>
            <div className="search-card-date">
              {search.timestamp
                ? formatDate(search.timestamp)
                : "Date unavailable"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
