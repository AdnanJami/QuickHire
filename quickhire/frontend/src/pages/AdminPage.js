import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Loader, XCircle, Briefcase, Users, Eye, ChevronDown, ChevronUp, Mail, FileText, ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getJobs, createJob, deleteJob, getApplications } from '../utils/api';

const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];
const LOGO_COLORS = ['#2B4EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7A399'];
const getLogoColor = (name) => LOGO_COLORS[(name || '').charCodeAt(0) % LOGO_COLORS.length];

const emptyForm = {
  title: '', company: '', location: '', category: 'Design',
  type: 'Full Time', description: '', salary: '', featured: false, tags: '',
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const AdminPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([getJobs({ limit: 50 }), getApplications()]);
      setJobs(jobsRes.data.data);
      setApplications(appsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      await createJob(payload);
      setSuccess('Job posted successfully!');
      setForm(emptyForm);
      setShowForm(false);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
      setSuccess('Job deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #E5E7EB', fontSize: 14,
    fontFamily: 'DM Sans', color: '#1A1A2E', outline: 'none',
  };
  const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 };

  const appsByJob = jobs.map(job => ({
    ...job,
    applicants: applications.filter(a => Number(a.job_id) === Number(job.id)),
  })).filter(job => job.applicants.length > 0);

  return (
    <div style={{ paddingTop: 72, background: '#F9FAFB', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #F3F4F6', padding: '32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: '#1A1A2E', marginBottom: 4 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Manage job listings and view applications</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats — uses CSS class for responsive grid */}
        <div className="admin-stats-grid">
          {[
            { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: '#EEF1FF', iconColor: '#2B4EFF' },
            { label: 'Applications', value: applications.length, icon: Users, color: '#F0FFF4', iconColor: '#16A34A' },
            { label: 'Featured Jobs', value: jobs.filter(j => j.featured).length, icon: CheckCircle, color: '#FFF3E0', iconColor: '#D97706' },
          ].map(({ label, value, icon: Icon, color, iconColor }) => (
            <div key={label} style={{ background: 'white', borderRadius: 16, border: '1.5px solid #F3F4F6', padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, background: color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={iconColor} />
              </div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28 }}>{value}</div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        {success && (
          <div style={{ background: '#F0FFF4', border: '1.5px solid #86EFAC', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <CheckCircle size={16} color="#16A34A" />
            <span style={{ color: '#15803D', fontWeight: 600, fontSize: 14 }}>{success}</span>
          </div>
        )}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <XCircle size={16} color="#EF4444" />
            <span style={{ color: '#DC2626', fontSize: 14 }}>{error}</span>
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>✕</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'white', borderRadius: 12, border: '1.5px solid #F3F4F6', padding: 6, width: 'fit-content' }}>
          {['jobs', 'applications'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: 8, border: 'none',
              background: activeTab === tab ? '#2B4EFF' : 'transparent',
              color: activeTab === tab ? 'white' : '#6B7280',
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                <Plus size={16} />
                {showForm ? 'Cancel' : 'Post New Job'}
              </button>
            </div>

            {showForm && (
              <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #EEF1FF', padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Post a New Job</h2>
                <form onSubmit={handleSubmit}>
                  {/* ✅ CSS class for responsive 2-col form grid */}
                  <div className="admin-form-grid">
                    {[
                      { label: 'Job Title *', key: 'title', placeholder: 'e.g. Senior Designer', required: true },
                      { label: 'Company *', key: 'company', placeholder: 'e.g. Acme Corp', required: true },
                      { label: 'Location *', key: 'location', placeholder: 'e.g. New York, USA', required: true },
                      { label: 'Salary', key: 'salary', placeholder: 'e.g. $80,000 - $100,000', required: false },
                    ].map(({ label, key, placeholder, required }) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input style={inputStyle} placeholder={placeholder} value={form[key]} required={required}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                          onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select style={inputStyle} value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Job Type *</label>
                      <select style={inputStyle} value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                        {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Tags (comma separated)</label>
                    <input style={inputStyle} placeholder="e.g. Design, Marketing, React" value={form.tags}
                      onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5}
                      placeholder="Describe the role, responsibilities, requirements..."
                      value={form.description} required
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  </div>
                  <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" id="featured" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: '#2B4EFF', cursor: 'pointer' }} />
                    <label htmlFor="featured" style={{ fontWeight: 600, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                      Feature this job listing
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Posting...</> : 'Post Job'}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Loader size={28} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(job => (
                  <div key={job.id} style={{ background: 'white', borderRadius: 16, border: '1.5px solid #F3F4F6', padding: '20px 24px' }}>
                    {/* Top row: logo + title + actions */}
                    <div className="admin-job-row">
                      <div className="logo-circle" style={{ background: getLogoColor(job.company), flexShrink: 0 }}>
                        {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: '#1A1A2E' }}>{job.title}</span>
                          {job.featured && (
                            <span style={{ background: '#FFF3E0', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Featured</span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: '#6B7280' }}>{job.company} · {job.location} · {job.type}</div>
                      </div>
                      {/* Actions */}
                      <div className="admin-job-actions">
                        <span style={{ background: '#EEF1FF', color: '#2B4EFF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {job.category}
                        </span>
                        <Link to={`/admin/jobs/${job.id}`}>
                          <button style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#EEF1FF', border: 'none', borderRadius: 8,
                            padding: '7px 12px', color: '#2B4EFF',
                            fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = '#DDE4FF'}
                            onMouseLeave={e => e.currentTarget.style.background = '#EEF1FF'}
                          >
                            <Eye size={13} /> Details
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id} style={{
                          width: 36, height: 36, background: '#FEF2F2', border: 'none', borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: deletingId === job.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                        }}
                          onMouseEnter={e => { if (deletingId !== job.id) e.currentTarget.style.background = '#FEE2E2'; }}
                          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                        >
                          {deletingId === job.id
                            ? <Loader size={14} color="#EF4444" style={{ animation: 'spin 1s linear infinite' }} />
                            : <Trash2 size={14} color="#EF4444" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Loader size={28} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : appsByJob.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No applications yet</h3>
                <p style={{ color: '#6B7280' }}>Applications will appear here once candidates apply</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {appsByJob.map(job => (
                  <div key={job.id} style={{
                    background: 'white', borderRadius: 16,
                    border: `1.5px solid ${expandedJob === job.id ? '#2B4EFF' : '#F3F4F6'}`,
                    overflow: 'hidden', transition: 'border-color 0.2s',
                  }}>
                    {/* Job Header */}
                    <div
                      style={{ padding: '20px 24px', cursor: 'pointer', background: expandedJob === job.id ? '#FAFBFF' : 'white' }}
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    >
                      <div className="admin-job-row">
                        <div className="logo-circle" style={{ background: getLogoColor(job.company), flexShrink: 0 }}>
                          {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: '#1A1A2E' }}>{job.title}</span>
                            {job.featured && (
                              <span style={{ background: '#FFF3E0', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Featured</span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span>{job.company}</span><span>·</span>
                            <MapPin size={11} /><span>{job.location}</span><span>·</span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <div className="admin-job-actions">
                          <div style={{
                            background: '#2B4EFF', color: 'white', borderRadius: 10, padding: '4px 12px',
                            fontSize: 13, fontWeight: 700, fontFamily: 'Syne',
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}>
                            <Users size={13} />
                            {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                          </div>
                          <Link to={`/admin/jobs/${job.id}`} onClick={e => e.stopPropagation()}>
                            <button style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              background: '#EEF1FF', border: 'none', borderRadius: 8,
                              padding: '7px 12px', color: '#2B4EFF',
                              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = '#DDE4FF'}
                              onMouseLeave={e => e.currentTarget.style.background = '#EEF1FF'}
                            >
                              <Eye size={12} /> Details
                            </button>
                          </Link>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                            disabled={deletingId === job.id}
                            style={{
                              width: 34, height: 34, background: '#FEF2F2', border: 'none', borderRadius: 8,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: deletingId === job.id ? 'not-allowed' : 'pointer',
                            }}
                            onMouseEnter={e => { if (deletingId !== job.id) e.currentTarget.style.background = '#FEE2E2'; }}
                            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                          >
                            {deletingId === job.id
                              ? <Loader size={13} color="#EF4444" style={{ animation: 'spin 1s linear infinite' }} />
                              : <Trash2 size={13} color="#EF4444" />
                            }
                          </button>
                          <div style={{ color: '#9CA3AF' }}>
                            {expandedJob === job.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applicants expanded */}
                    {expandedJob === job.id && (
                      <div style={{ borderTop: '1px solid #EEF1FF', padding: '16px 24px', background: '#FAFBFF' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {job.applicants.map((app) => (
                            <div key={app.id} style={{
                              background: 'white', borderRadius: 12,
                              border: '1.5px solid #F3F4F6', padding: '16px 20px',
                            }}>
                              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                  background: getLogoColor(app.name),
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: 'white', fontFamily: 'Syne', fontWeight: 700, fontSize: 16,
                                }}>
                                  {app.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#1A1A2E' }}>{app.name}</span>
                                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(app.created_at)}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
                                    <Mail size={11} /> {app.email}
                                  </div>
                                  <p style={{
                                    background: '#F9FAFB', border: '1px solid #F3F4F6',
                                    borderRadius: 8, padding: '10px 12px',
                                    fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '0 0 10px',
                                  }}>
                                    {app.cover_note}
                                  </p>
                                  <a href={app.resume_link} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    background: '#EEF1FF', color: '#2B4EFF',
                                    padding: '6px 12px', borderRadius: 8,
                                    fontSize: 12, fontWeight: 600, textDecoration: 'none',
                                  }}>
                                    <FileText size={12} /> View Resume <ExternalLink size={10} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .admin-job-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-job-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .admin-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .admin-form-grid {
            grid-template-columns: 1fr;
          }
          .admin-job-row {
            flex-wrap: wrap;
          }
          .admin-job-actions {
            width: 100%;
            flex-wrap: wrap;
            margin-top: 8px;
            padding-top: 12px;
            border-top: 1px solid #F3F4F6;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;