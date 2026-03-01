import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, ArrowLeft, CheckCircle, XCircle, Loader } from 'lucide-react';
import { getJob, submitApplication } from '../utils/api';

const LOGO_COLORS = ['#2B4EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7A399'];
const getLogoColor = (name) => LOGO_COLORS[(name || '').charCodeAt(0) % LOGO_COLORS.length];

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', resume_link: '', cover_note: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJob(id);
        setJob(res.data.data);
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.resume_link.trim()) errors.resume_link = 'Resume link is required';
    else if (!form.resume_link.startsWith('http')) errors.resume_link = 'Must be a valid URL starting with http';
    if (!form.cover_note.trim()) errors.cover_note = 'Cover note is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitApplication({ ...form, job_id: id });
      setSubmitted(true);
      setForm({ name: '', email: '', resume_link: '', cover_note: '' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: `1.5px solid ${formErrors[fieldName] ? '#EF4444' : '#E5E7EB'}`,
    fontSize: 15,
    fontFamily: 'DM Sans',
    color: '#1A1A2E',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white',
  });

  if (loading) return (
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
      <Link to="/jobs"><button className="btn-primary" style={{ marginTop: 20 }}>Browse Jobs</button></Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 72, background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Back nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
          <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
        {/* Left: Job Details */}
        <div>
          {/* Header card */}
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #F3F4F6', padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
              <div
                className="logo-circle"
                style={{ width: 64, height: 64, fontSize: 26, borderRadius: 16, background: getLogoColor(job.company) }}
              >
                {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: '#1A1A2E', marginBottom: 6 }}>
                  {job.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 16, color: '#374151' }}>{job.company}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280', fontSize: 14 }}>
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span style={{
                    background: '#EEF1FF', color: '#2B4EFF',
                    padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  }}>
                    {job.type}
                  </span>
                  <span style={{
                    background: '#F0FFF4', color: '#16A34A',
                    padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  }}>
                    {job.category}
                  </span>
                </div>
              </div>
            </div>

            {job.salary && job.salary !== 'Competitive' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FFF3E0', color: '#E65100',
                padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              }}>
                <DollarSign size={16} />
                {job.salary}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #F3F4F6', padding: 32 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, color: '#1A1A2E', marginBottom: 20 }}>
              Job Description
            </h2>
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>
              {job.description}
            </p>

            {(job.tags || []).length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Skills & Tags</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {job.tags.map((tag, i) => (
                    <span key={i} style={{
                      background: '#EEF1FF', color: '#2B4EFF',
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Apply Form */}
        <div>
          <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #F3F4F6', padding: 32, position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#1A1A2E', marginBottom: 8 }}>
              Apply Now
            </h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
              Submit your application for <strong>{job.title}</strong>
            </p>

            {submitted ? (
              <div style={{
                background: '#F0FFF4',
                border: '1.5px solid #86EFAC',
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
              }}>
                <CheckCircle size={40} color="#16A34A" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#15803D', marginBottom: 8 }}>
                  Application Submitted!
                </h3>
                <p style={{ color: '#166534', fontSize: 14 }}>
                  We'll review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                >
                  Apply Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div style={{
                    background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
                    padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <XCircle size={16} color="#EF4444" />
                    <span style={{ color: '#DC2626', fontSize: 14 }}>{submitError}</span>
                  </div>
                )}

                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: '' })); }}
                    style={inputStyle('name')}
                    onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                    onBlur={e => e.target.style.borderColor = formErrors.name ? '#EF4444' : '#E5E7EB'}
                  />
                  {formErrors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormErrors(fe => ({ ...fe, email: '' })); }}
                    style={inputStyle('email')}
                    onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                    onBlur={e => e.target.style.borderColor = formErrors.email ? '#EF4444' : '#E5E7EB'}
                  />
                  {formErrors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{formErrors.email}</p>}
                </div>

                {/* Resume */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>
                    Resume Link (URL) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/your-resume"
                    value={form.resume_link}
                    onChange={e => { setForm(f => ({ ...f, resume_link: e.target.value })); setFormErrors(fe => ({ ...fe, resume_link: '' })); }}
                    style={inputStyle('resume_link')}
                    onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                    onBlur={e => e.target.style.borderColor = formErrors.resume_link ? '#EF4444' : '#E5E7EB'}
                  />
                  {formErrors.resume_link && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{formErrors.resume_link}</p>}
                </div>

                {/* Cover Note */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>
                    Cover Note *
                  </label>
                  <textarea
                    placeholder="Tell us why you're a great fit for this role..."
                    value={form.cover_note}
                    onChange={e => { setForm(f => ({ ...f, cover_note: e.target.value })); setFormErrors(fe => ({ ...fe, cover_note: '' })); }}
                    rows={5}
                    style={{ ...inputStyle('cover_note'), resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#2B4EFF'}
                    onBlur={e => e.target.style.borderColor = formErrors.cover_note ? '#EF4444' : '#E5E7EB'}
                  />
                  {formErrors.cover_note && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{formErrors.cover_note}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          div[style*='gridTemplateColumns: 1fr 400px'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JobDetailPage;
