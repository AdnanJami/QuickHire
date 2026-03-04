/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../static/logo.png';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#1A1A2E', color: 'white', padding: '60px 0 30px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={logo} alt="QuickHire Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'white' }}>QuickHire</span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
              Great platform for the job seeker that's passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>About</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Companies', 'Pricing', 'Terms', 'Advice', 'Privacy Policy'].map(item => (
                <a key={item} href="#" style={{ color: '#9CA3AF', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Help Docs', 'Guide', 'Updates', 'Contact Us'].map(item => (
                <a key={item} href="#" style={{ color: '#9CA3AF', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Get job notifications</h4>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: '#2D2D4A',
                  border: '1px solid #374151',
                  padding: '10px 14px',
                  fontSize: 14,
                  color: 'white',
                  outline: 'none',
                }}
              />
              <button className="btn-primary" style={{ padding: '10px 16px', fontSize: 14 }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #2D2D4A', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" style={{ color: '#6B7280', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
