import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, TrendingUp, Users, DollarSign, Monitor, Settings, BarChart2, ChevronRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import { getJobs } from '../utils/api';
import person_image from '../static/image.png';
import { LiaPencilRulerSolid,LiaCodeSolid } from "react-icons/lia";
import { TbChartInfographic,TbDeviceImac } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
import { HiCash } from "react-icons/hi";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
const CATEGORIES = [
  { name: 'Design',          count: '235 jobs available', icon: <LiaPencilRulerSolid color="#4640DE" size={28} /> },
  { name: 'Sales',           count: '756 jobs available', icon: <TbChartInfographic  color="#4640DE" size={28} /> },
  { name: 'Marketing',       count: '140 jobs available', icon: <GrAnnounce color="#4640DE" size={28} /> },
  { name: 'Finance',         count: '325 jobs available', icon: <HiCash color="#4640DE" size={28} /> },
  { name: 'Technology',      count: '416 jobs available', icon: <TbDeviceImac color="#4640DE" size={28} /> },
  { name: 'Engineering',     count: '542 jobs available', icon: <LiaCodeSolid color="#4640DE" size={28} /> },
  { name: 'Business',        count: '211 jobs available', icon: <LuBriefcaseBusiness color="#4640DE" size={28} /> },
  { name: 'Human Resources', count: '346 jobs available', icon: <FaUsers color="#4640DE" size={28} /> },
];

const COMPANIES = ['vodafone', 'intel', 'TESLA', 'AMD', 'Talkit'];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          getJobs({ featured: 'true', limit: 8 }),
          getJobs({ limit: 8 }),
        ]);
        setFeaturedJobs(featuredRes.data.data);
        setLatestJobs(latestRes.data.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF1FF 100%)',
        paddingTop: 100,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(43,78,255,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(43,78,255,0.04) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="animate-fade-in-up">
              <h1 style={{
                fontFamily: 'Syne',
                fontSize: 'clamp(36px, 5vw, 58px)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#1A1A2E',
                marginBottom: 20,
              }}>
                Discover more than <br />
                <span style={{ color: '#2B4EFF', position: 'relative' }}>
                  5000+ Jobs
                  <svg style={{ position: 'absolute', bottom: -8, left: 0, width: '100%' }} height="6" viewBox="0 0 200 6">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#2B4EFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
                Great platform for the job seeker that's searching for new career heights and passionate about startups.
              </p>

              <div style={{ marginBottom: 20 }}>
                <SearchBar onSearch={handleSearch} />
              </div>

              <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                <span style={{ fontWeight: 600 }}>Popular:</span>{' '}
                {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((t, i) => (
                  <span key={t}>
                    <Link
                      to={`/jobs?search=${t}`}
                      style={{ color: '#6B7280', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.target.style.color = '#2B4EFF'; e.target.style.textDecorationColor = '#2B4EFF'; }}
                      onMouseLeave={e => { e.target.style.color = '#6B7280'; e.target.style.textDecorationColor = 'transparent'; }}
                    >
                      {t}
                    </Link>
                    {i < 3 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>

            {/* Hero image area */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-img-col">
              <img src={person_image} alt="person" />
            </div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section style={{ padding: '20px 0', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginBottom: 28, fontWeight: 500 }}>
            Companies we helped grow
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {COMPANIES.map(c => (
              <span key={c} style={{
                fontFamily: 'Syne',
                fontWeight: 700,
                fontSize: 40,
                color: '#C4C4C4',
                letterSpacing: c === 'TESLA' ? 3 : 0,
                transition: 'color 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => e.target.style.color = '#1A1A2E'}
                onMouseLeave={e => e.target.style.color = '#C4C4C4'}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <h2 className="section-title">
              Explore by <span>category</span>
            </h2>
            <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2B4EFF', fontWeight: 600, fontSize: 14 }}>
              Show all jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: cat.active ? '#2B4EFF' : '#ffffff11',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  border: '1.5px solid transparent',
                }}
                  onMouseEnter={e => {
                    if (!cat.active) {
                      e.currentTarget.style.borderColor = '#2B4EFF';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(43,78,255,0.12)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!cat.active) {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{cat.icon}</div>
                  <div style={{
                    fontFamily: 'Syne',
                    fontWeight: 700,
                    fontSize: 16,
                    color: cat.active ? 'white' : '#1A1A2E',
                    marginBottom: 6,
                  }}>
                    {cat.name}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: cat.active ? 'rgba(255,255,255,0.8)' : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    {cat.count} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: '#4640DE',
            padding: '60px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: -40, top: -40,
              width: 300, height: 300,
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'white', marginBottom: 12 }}>
                Start posting jobs today
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 28 }}>
                Start posting jobs for only $10.
              </p>
              <Link to="/admin">
                <button style={{
                  background: 'white',
                  color: '#2B4EFF',
                  border: 'none',
                  padding: '12px 28px',
                  fontFamily: 'DM Sans',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                >
                  Sign Up For Free
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'rgba(255,255,255,0.12)',
                padding: 24,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                width: '100%',
                maxWidth: 300,
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {['76', '24', '12', '67'].map((n, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.15)',
                      padding: '8px 8px',
                      flex: 1,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'white' }}>{n}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart2 size={40} color="rgba(255,255,255,0.5)" />
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '6px 10px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Applications</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'white', fontSize: 14 }}>2,342</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '6px 10px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Jobs</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'white', fontSize: 14 }}>454</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 className="section-title">Featured <span>jobs</span></h2>
            <Link to="/jobs?featured=true" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2B4EFF', fontWeight: 600, fontSize: 14 }}>
              Show all jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ height: 180, background: '#F3F4F6', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {featuredJobs.slice(0, 8).map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Jobs */}
      <section style={{ padding: '0 0 80px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 className="section-title">Latest <span>jobs open</span></h2>
            <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2B4EFF', fontWeight: 600, fontSize: 14 }}>
              Show all jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ height: 140, background: '#F3F4F6'}} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {latestJobs.slice(0, 8).map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .hero-img-col { display: none !important; }
        }
        @media (max-width: 768px) {
          section > div > div[style*='grid-template-columns: repeat(4'] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*='grid-template-columns: 1fr 1fr'] {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
