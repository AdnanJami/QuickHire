import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, DollarSign, ArrowLeft, Loader, Users,
  Mail, ExternalLink, Calendar, FileText, Trash2, CheckCircle,
} from 'lucide-react';
import { getJob, deleteJob, getApplicationsByJob } from '../utils/api';

const LOGO_COLORS = ['#2B4EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7A399'];
const getLogoColor = (name) => LOGO_COLORS[(name || '').charCodeAt(0) % LOGO_COLORS.length];
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const AdminJobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJob(id);
        setJob(res.data.data);
      } catch {
        setError('Job not found');
      } finally {
        setLoadingJob(false);
      }
    };
    const fetchApplications = async () => {
      try {
        const res = await getApplicationsByJob(id);
        setApplications(res.data.data);
      } catch {
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchJob();
    fetchApplications();
  }, [id]);

  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job? All applications will also be deleted.')) return;
    setDeleting(true);
    try {
      await deleteJob(id);
      setDeleted(true);
    } catch {
      alert('Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  if (loadingJob) return (
    <div style={{ paddingTop: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size={32} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 12, color: '#6B7280' }}>Loading job details...</p>
      </div>
    </div>
  );

  if (error || !job) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <p style={{ color: '#EF4444', fontSize: 18 }}>{error || 'Job not found'}</p>
      <Link to="/admin"><button className="btn-primary" style={{ marginTop: 20 }}>Back to Admin</button></Link>
    </div>
  );

  if (deleted) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <CheckCircle size={48} color="#16A34A" style={{ margin: '0 auto 16px' }} />
      <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Job Deleted</h2>
      <p style={{ color: '#6B7280', marginBottom: 20 }}>The job listing has been removed.</p>
      <Link to="/admin"><button className="btn-primary">Back to Admin</button></Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 72, background: '#F9FAFB', minHeight: '100vh' }}>

      {/* Back nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Admin
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#EEF1FF', color: '#2B4EFF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              Admin View
            </span>
            <button onClick={handleDeleteJob} disabled={deleting} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 8,
              padding: '7px 14px', color: '#DC2626',
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
              cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
            }}
              onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#FEE2E2'; }}
              onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
            >
              {deleting ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
              Delete Job
            </button>
          </div>
        </div>
      </div>

      {/* ✅ CSS class for responsive 2-col layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div className="admin-detail-grid">

          {/* Left: Job Info */}
          <div>
            <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #F3F4F6', padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                <div className="logo-circle" style={{ width: 64, height: 64, fontSize: 26, borderRadius: 16, background: getLogoColor(job.company), flexShrink: 0 }}>
                  {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 26, color: '#1A1A2E', marginBottom: 8 }}>
                    {job.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#374151' }}>{job.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280', fontSize: 13 }}>
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span style={{ background: '#EEF1FF', color: '#2B4EFF', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{job.type}</span>
                    <span style={{ background: '#F0FFF4', color: '#16A34A', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{job.category}</span>
                    {job.featured && <span style={{ background: '#FFF3E0', color: '#D97706', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⭐ Featured</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {job.salary && job.salary !== 'Competitive' && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF3E0', color: '#E65100', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                    <DollarSign size={14} /> {job.salary}
                  </div>
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F3F4F6', color: '#6B7280', padding: '6px 14px', borderRadius: 10, fontSize: 13 }}>
                  <Calendar size={14} /> Posted {formatDate(job.created_at)}
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #F3F4F6', padding: 32 }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: '#1A1A2E', marginBottom: 16 }}>Job Description</h2>
              <p style={{ color: '#374151', lineHeight: 1.85, fontSize: 15, whiteSpace: 'pre-wrap' }}>{job.description}</p>
              {(job.tags || []).length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Tags</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {job.tags.map((tag, i) => (
                      <span key={i} style={{ background: '#EEF1FF', color: '#2B4EFF', padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Applicants Panel */}
          {/* ✅ Removed sticky/maxHeight on mobile via CSS class */}
          <div>
            <div className="applicants-panel">
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#1A1A2E' }}>Applicants</h2>
                  {!loadingApps && (
                    <div style={{
                      background: applications.length > 0 ? '#2B4EFF' : '#F3F4F6',
                      color: applications.length > 0 ? 'white' : '#6B7280',
                      width: 32, height: 32, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                    }}>
                      {applications.length}
                    </div>
                  )}
                </div>
                <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>People who applied for this role</p>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
                {loadingApps ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                    <Loader size={24} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div style={{ width: 64, height: 64, background: '#F3F4F6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Users size={28} color="#9CA3AF" />
                    </div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 }}>No applicants yet</h3>
                    <p style={{ color: '#9CA3AF', fontSize: 13 }}>Applications will appear here once candidates apply</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {applications.map((app) => (
                      <div key={app.id} style={{
                        border: `1.5px solid ${expandedApp === app.id ? '#2B4EFF' : '#F3F4F6'}`,
                        borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s',
                        background: expandedApp === app.id ? '#FAFBFF' : 'white',
                      }}>
                        <div onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                          style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 10, background: getLogoColor(app.name),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontFamily: 'Syne', fontWeight: 700, fontSize: 15, flexShrink: 0,
                          }}>
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#1A1A2E', marginBottom: 2 }}>{app.name}</div>
                            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                              <Mail size={11} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.email}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(app.created_at)}</span>
                            <span style={{ fontSize: 11, color: expandedApp === app.id ? '#2B4EFF' : '#9CA3AF', fontWeight: 600 }}>
                              {expandedApp === app.id ? '▲ hide' : '▼ view'}
                            </span>
                          </div>
                        </div>
                        {expandedApp === app.id && (
                          <div style={{ padding: '0 16px 16px', borderTop: '1px solid #EEF1FF' }}>
                            <div style={{ marginTop: 12, marginBottom: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Resume</div>
                              <a href={app.resume_link} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: '#EEF1FF', color: '#2B4EFF', padding: '7px 14px',
                                borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                              }}>
                                <FileText size={13} /> View Resume <ExternalLink size={11} />
                              </a>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cover Note</div>
                              <p style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                                {app.cover_note}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .admin-detail-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 32px;
        }

        .applicants-panel {
          background: white;
          border-radius: 20px;
          border: 1.5px solid #F3F4F6;
          overflow: hidden;
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 960px) {
          .admin-detail-grid {
            grid-template-columns: 1fr;
          }
          .applicants-panel {
            position: static;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminJobDetailPage;