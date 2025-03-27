// client/src/utils/cache.js

const CACHE_KEY = "recent_job_searches";
const MAX_CACHE_ITEMS = 50; // Limit to prevent excessive storage usage

// Ensures stored searches have required fields and fixes inconsistencies
export const migrateCache = () => {
  try {
    const existingCache = getRecentSearches();
    
    const fixedCache = existingCache.map(item => ({
      id: item.id || Date.now().toString(),
      company: item.company?.trim() || "Unknown Company",
      jobTitle: item.jobTitle?.trim() || "Unknown Position",
      jobPost: item.jobPost || "",
      questions: item.questions || [],
      timestamp: item.timestamp || new Date().toISOString(),
    }));

    localStorage.setItem(CACHE_KEY, JSON.stringify(fixedCache));
    return fixedCache;
  } catch (error) {
    console.error("Error migrating cache:", error);
    return [];
  }
};

// Saves a new search, ensuring uniqueness and cache size limits
export const saveSearch = (data) => {
  try {
    console.log("Saving search:", data);

    const searchToSave = {
      id: Date.now().toString(),
      company: data.company?.trim() || "Unknown Company",
      jobTitle: data.jobTitle?.trim() || "Unknown Position",
      jobPost: data.jobPost || "",
      questions: data.questions || [],
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const existingCache = getRecentSearches();

    // Prevent duplicate entries
    const isDuplicate = existingCache.some(
      (item) =>
        item.jobPost === searchToSave.jobPost &&
        item.company === searchToSave.company &&
        item.jobTitle === searchToSave.jobTitle
    );

    if (isDuplicate) {
      console.log("Duplicate search detected, not saving");
      return existingCache;
    }

    const updatedCache = [searchToSave, ...existingCache].slice(0, MAX_CACHE_ITEMS);

    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
    console.log("Search saved, cache updated");
    return updatedCache;
  } catch (error) {
    console.error("Error saving to cache:", error);
    return getRecentSearches();
  }
};

// Retrieves recent searches from local storage, migrating if necessary
export const getRecentSearches = () => {
  try {
    const cacheJson = localStorage.getItem(CACHE_KEY);
    if (!cacheJson) return [];

    const cache = JSON.parse(cacheJson);

    return cache.some((item) => !item.id || !item.company || !item.jobTitle || !item.timestamp)
      ? migrateCache()
      : cache;
  } catch (error) {
    console.error("Error retrieving cache:", error);
    return [];
  }
};

// Removes a search entry by ID
export const removeSearch = (searchId) => {
  try {
    const updatedCache = getRecentSearches().filter((item) => item.id !== searchId);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
    return updatedCache;
  } catch (error) {
    console.error("Error removing from cache:", error);
    return getRecentSearches();
  }
};

// Generates a display title for a saved search
export const getDisplayTitle = (search) => {
  if (search.company && search.jobTitle) {
    return `${search.company} - ${search.jobTitle}`;
  }
  if (search.company) {
    return search.company;
  }
  if (search.jobTitle) {
    return search.jobTitle;
  }
  const firstLine = search.jobPost.split("\n")[0];
  return firstLine.length > 40 ? `${firstLine.substring(0, 40)}...` : firstLine;
};