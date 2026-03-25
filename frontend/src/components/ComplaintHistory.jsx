import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, Clock3, Zap, CheckCircle } from 'lucide-react';

const STATUS_INFO = {
  0: { label: 'Pending', color: '#f59e0b', icon: <Clock3 size={12} /> },
  1: { label: 'In Progress', color: '#3b82f6', icon: <Zap size={12} /> },
  2: { label: 'Resolved', color: '#10b981', icon: <CheckCircle size={12} /> },
};

function ComplaintHistory({ complaintId, contract }) {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    if (open) { setOpen(false); return; }
    try {
      setLoading(true);
      const h = await contract.getComplaintHistory(complaintId);
      setHistory(h);
      setOpen(true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={loadHistory}
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '6px', padding: '5px 12px',
          color: '#6366f1', fontSize: '12px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '5px',
          cursor: 'pointer',
        }}>
        <Clock size={12} />
        {loading ? 'Loading...' : open ? 'Hide History' : 'View Audit Trail'}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div style={{
              marginTop: '10px', paddingLeft: '12px',
              borderLeft: '2px solid rgba(99,102,241,0.3)',
            }}>
              {history.map((h, i) => {
                const s = STATUS_INFO[Number(h.status)];
                const date = new Date(Number(h.timestamp) * 1000)
                  .toLocaleString('en-IN', {
                    day: 'numeric', month: 'short',
                    hour: '2-digit', minute: '2-digit'
                  });
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      marginBottom: '12px', position: 'relative',
                      paddingLeft: '16px',
                    }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: '-7px', top: '4px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: s.color,
                      boxShadow: `0 0 6px ${s.color}`,
                    }} />

                    {/* Status badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '3px',
                        fontSize: '11px', fontWeight: 700,
                        color: s.color,
                      }}>{s.icon} {s.label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {date}</span>
                    </div>

                    {/* Remark */}
                    {h.remark && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0' }}>
                        "{h.remark}"
                      </p>
                    )}

                    {/* Changed by */}
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      by {h.changedBy === '0x0000000000000000000000000000000000000000'
                        ? 'Anonymous'
                        : `${h.changedBy.slice(0, 6)}...${h.changedBy.slice(-4)}`}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ComplaintHistory;
