import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

const LOGO_COLORS = [
  '#2B4EFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7A399', '#B0C4DE',
];

const getLogoColor = (name) => {
  const index = (name || '').charCodeAt(0) % LOGO_COLORS.length;
  return LOGO_COLORS[index];
};

const getTagClass = (tag) => {
  const map = {
    Marketing: 'tag-marketing',
    Design: 'tag-design',
    Business: 'tag-business',
    Technology: 'tag-technology',
    Engineering: 'tag-engineering',
    Finance: 'tag-finance',
    Management: 'tag-design',
  };
  return map[tag] || 'tag-design';
};

const JobCard = ({ job, style = {} }) => {
  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ padding: 20, ...style }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              className="logo-circle"
              style={{ background: getLogoColor(job.company) }}
            >
              {(job.logo || job.company?.charAt(0) || 'J').toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{job.company}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, color: '#1A1A2E' }}>
                {job.title}
              </div>
            </div>
          </div>
          <span style={{
            background: '#F0F9FF',
            color: '#0369A1',
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {job.type}
          </span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, marginBottom: 12 }}>
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13,
          color: '#6B7280',
          lineHeight: 1.5,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {job.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(job.tags || []).slice(0, 3).map((tag, i) => (
            <span key={i} className={`tag ${getTagClass(tag)}`}>{tag}</span>
          ))}
          {job.category && !(job.tags || []).includes(job.category) && (
            <span className={`tag ${getTagClass(job.category)}`}>{job.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
