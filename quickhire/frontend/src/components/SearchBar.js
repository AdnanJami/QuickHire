import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, initialSearch = '', initialLocation = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      padding: '8px 8px 8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: '1.5px solid #F3F4F6',
    }}>
      {/* Job search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <Search size={18} color="#6B7280" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Job title or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#1A1A2E',
            background: 'transparent',
            width: '100%',
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: '#E5E7EB', flexShrink: 0 }} />

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <MapPin size={18} color="#6B7280" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#1A1A2E',
            background: 'transparent',
            width: '100%',
          }}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
        Search my job
      </button>
    </form>
  );
};

export default SearchBar;
