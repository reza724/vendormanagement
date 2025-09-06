import React, { useState } from "react";
import "../static/css/searchstyle.css";

export const SearchField = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1 max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-400 text-sm"></i>
      </div>
      <input
        type="text"
        placeholder="بر اساس نام شرکت مدنظر جستجو کنید..."
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
        id="searchInput"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchField;
