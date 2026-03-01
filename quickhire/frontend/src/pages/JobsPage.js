import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import { getJobs } from '../utils/api';

const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';

  const LIMIT = 9;
  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await getJobs({ search, location, category, type, page, limit: LIMIT });
        setJobs(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, location, category, type, page]);

  const handleSearch = ({ search: s, location: l }) => {
    const params = {};
    if (s) params.search = s;
    if (l) params.location = l;
    if (category) params.category = category;
    if (type) params.type = type;
    setSearchParams(params);
    setPage(1);
  };

  const clearAll = () => {
    setSearchParams({});
    setPage(1);
  };

  const setFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (params[key] === value) {
      delete params[key];
    } else {
      params[key] = value;
    }
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF1FF 100%)', padding: '48px 0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 36, color: '#1A1A2E', marginBottom: 8 }}>
            Browse <span style={{ color: '#2B4EFF' }}>Jobs</span>
          </h1>
          <p style={{ color: '#6B7280', marginBottom: 28 }}>
            {total > 0 ? `Showing ${total} jobs available` : 'Search for your perfect role'}
          </p>
          <SearchBar onSearch={handleSearch} initialSearch={search} initialLocation={location} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
        {/* Sidebar Filters */}
        <aside>
          {/* Category Filter */}
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #F3F4F6', padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#1A1A2E', marginBottom: 16 }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter('category', cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: category === cat ? '#EEF1FF' : 'transparent',
                    color: category === cat ? '#2B4EFF' : '#374151',
                    fontFamily: 'DM Sans',
                    fontWeight: category === cat ? 600 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {cat}
                  {category === cat && <span style={{ fontSize: 12, color: '#2B4EFF' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type Filter */}
          <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #F3F4F6', padding: 24 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#1A1A2E', marginBottom: 16 }}>Job Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {JOB_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter('type', t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: type === t ? '#EEF1FF' : 'transparent',
                    color: type === t ? '#2B4EFF' : '#374151',
                    fontFamily: 'DM Sans',
                    fontWeight: type === t ? 600 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `2px solid ${type === t ? '#2B4EFF' : '#D1D5DB'}`,
                    background: type === t ? '#2B4EFF' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {type === t && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                  </div>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Job Grid */}
        <main>
          {/* Active filters */}
          {(search || location || category || type) && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
              {search && (
                <button onClick={() => { const p = Object.fromEntries(searchParams.entries()); delete p.search; setSearchParams(p); setPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#EEF1FF', border: 'none', borderRadius: 20, color: '#2B4EFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  🔍 {search} ✕
                </button>
              )}
              {location && (
                <button onClick={() => { const p = Object.fromEntries(searchParams.entries()); delete p.location; setSearchParams(p); setPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#EEF1FF', border: 'none', borderRadius: 20, color: '#2B4EFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  📍 {location} ✕
                </button>
              )}
              {category && (
                <button onClick={() => setFilter('category', category)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#EEF1FF', border: 'none', borderRadius: 20, color: '#2B4EFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  {category} ✕
                </button>
              )}
              {type && (
                <button onClick={() => setFilter('type', type)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#EEF1FF', border: 'none', borderRadius: 20, color: '#2B4EFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  {type} ✕
                </button>
              )}
              <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: '#1A1A2E', border: 'none', borderRadius: 20, color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  height: 200, background: '#F3F4F6', borderRadius: 16,
                  animation: 'pulse 1.5s ease infinite',
                }} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No jobs found</h3>
              <p style={{ color: '#6B7280' }}>Try different search terms or remove filters</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      border: '1.5px solid #E5E7EB',
                      background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      opacity: page === 1 ? 0.4 : 1,
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: page === i + 1 ? 'none' : '1.5px solid #E5E7EB',
                        background: page === i + 1 ? '#2B4EFF' : 'white',
                        color: page === i + 1 ? 'white' : '#374151',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        fontFamily: 'DM Sans',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      border: '1.5px solid #E5E7EB',
                      background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      opacity: page === totalPages ? 0.4 : 1,
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 900px) {
          main > div[style*='repeat(3'] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          div[style*='gridTemplateColumns: 260px'] {
            grid-template-columns: 1fr !important;
          }
          main > div[style*='repeat(3'] {
            grid-template-columns: 1fr !important;
          }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
};

export default JobsPage;