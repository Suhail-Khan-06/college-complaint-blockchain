import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, FileText, Settings, LogOut, User } from 'lucide-react';

function Navbar({ account, isAdmin, role, onConnectAdmin, onConnectStudent, onDisconnect, loading }) {
  const location = useLocation();

  const navLinks = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ...(!isAdmin ? [{ path: '/my-complaints', label: 'My Complaints', icon: <FileText size={16} /> }] : []),
  ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: <Settings size={16} /> }] : []),
];

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <nav style={{
      background: 'rgba(17,17,24,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '65px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'var(--gradient)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Shield size={20} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            ComplaintChain
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Blockchain Powered
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      {account && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: 500, transition: 'all 0.2s',
                  background: location.pathname === link.path ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: location.pathname === link.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: location.pathname === link.path ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}>
                {link.icon} {link.label}
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Wallet / Login */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {account ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isAdmin ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${isAdmin ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`,
                borderRadius: '10px', padding: '8px 14px',
              }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isAdmin ? 'var(--accent-blue)' : 'var(--accent-green)',
                boxShadow: `0 0 8px ${isAdmin ? 'var(--accent-blue)' : 'var(--accent-green)'}`,
              }} />
              <User size={14} color={isAdmin ? 'var(--accent-blue)' : 'var(--accent-green)'} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: isAdmin ? 'var(--accent-blue)' : 'var(--accent-green)' }}>
                {shortAddress}
              </span>
              {isAdmin && (
                <span style={{
                  fontSize: '10px', background: 'var(--gradient)',
                  padding: '2px 7px', borderRadius: '20px', color: 'white', fontWeight: 600
                }}>ADMIN</span>
              )}
            </motion.div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onDisconnect}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px 10px', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center',
              }}>
              <LogOut size={15} />
            </motion.button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onConnectStudent} disabled={loading}
              style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '10px', padding: '9px 16px',
                color: 'var(--accent-green)', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <User size={14} /> {loading ? 'Connecting...' : 'Login as Student'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onConnectAdmin} disabled={loading}
              style={{
                background: 'var(--gradient)', border: 'none',
                borderRadius: '10px', padding: '9px 16px',
                color: 'white', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <Settings size={14} /> {loading ? 'Connecting...' : 'Login as Admin'}
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
