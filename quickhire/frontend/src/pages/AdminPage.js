import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Loader, XCircle, Briefcase, Users } from 'lucide-react';
import { getJobs, createJob, deleteJob, getApplications } from '../utils/api';

const CATEGORIES = ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

const LOGO_COLORS = ['#2B4EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7A399'];
const getLogoColor = (name) => LOGO_COLORS[(name || '').charCodeAt(0) % LOGO_COLORS.length];

const emptyForm = {
  title: '', company: '', location: '', category: 'Design',
  type: 'Full Time', description: '', salary: '', featured: false, tags: '',
};

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
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
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
      setJobs(jobs.filter(j => j._id !== id));
      setSuccess('Job deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #E5E7EB',
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: '#1A1A2E',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  };

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
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
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
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === tab ? '#2B4EFF' : 'transparent',
                color: activeTab === tab ? 'white' : '#6B7280',
                fontFamily: 'DM Sans',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={16} />
                {showForm ? 'Cancel' : 'Post New Job'}
              </button>
            </div>

            {/* New Job Form */}
            {showForm && (
              <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #EEF1FF', padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Post a New Job</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Job Title *</label>
                      <input style={inputStyle} placeholder="e.g. Senior Designer" value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Company *</label>
                      <input style={inputStyle} placeholder="e.g. Acme Corp" value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Location *</label>
                      <input style={inputStyle} placeholder="e.g. New York, USA" value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Salary</label>
                      <input style={inputStyle} placeholder="e.g. $80,000 - $100,000" value={form.salary}
                        onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select style={inputStyle} value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Job Type *</label>
                      <select style={inputStyle} value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                        {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'} required />
                  </div>
                  <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" id="featured" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: '#2B4EFF', cursor: 'pointer' }} />
                    <label htmlFor="featured" style={{ fontWeight: 600, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                      Feature this job listing
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
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

            {/* Jobs List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Loader size={28} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(job => (
                  <div key={job._id} style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1.5px solid #F3F4F6',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'border-color 0.2s',
                  }}>
                    <div className="logo-circle" style={{ background: getLogoColor(job.company), flexShrink: 0 }}>
                      {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, color: '#1A1A2E' }}>{job.title}</span>
                        {job.featured && (
                          <span style={{ background: '#FFF3E0', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>
                        {job.company} · {job.location} · {job.type}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        background: '#EEF1FF', color: '#2B4EFF',
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      }}>
                        {job.category}
                      </span>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deletingId === job._id}
                        style={{
                          width: 36, height: 36,
                          background: '#FEF2F2',
                          border: 'none',
                          borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: deletingId === job._id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (deletingId !== job._id) e.currentTarget.style.background = '#FEE2E2'; }}
                        onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                      >
                        {deletingId === job._id
                          ? <Loader size={14} color="#EF4444" style={{ animation: 'spin 1s linear infinite' }} />
                          : <Trash2 size={14} color="#EF4444" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Loader size={28} color="#2B4EFF" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No applications yet</h3>
                <p style={{ color: '#6B7280' }}>Applications will appear here once candidates apply</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applications.map(app => (
                  <div key={app._id} style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1.5px solid #F3F4F6',
                    padding: '20px 24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#1A1A2E', marginBottom: 4 }}>
                          {app.name}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: 13 }}>{app.email}</div>
                      </div>
                      <span style={{ color: '#9CA3AF', fontSize: 12 }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <a href={app.resume_link} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#2B4EFF', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                      📎 View Resume
                    </a>
                    <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, background: '#F9FAFB', borderRadius: 8, padding: '10px 14px' }}>
                      {app.cover_note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          div[style*='gridTemplateColumns: 1fr 1fr'] { grid-template-columns: 1fr !important; }
          div[style*='gridTemplateColumns: repeat(3, 1fr)'] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
