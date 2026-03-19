import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, RefreshCw } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';

function AdminPanel({ contract }) {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  async function loadComplaints() {
    if (!contract) return;
    try {
      setLoading(true);
      const all = await contract.getAllComplaints();
      setComplaints([...all].reverse());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadComplaints(); }, [contract]);

  async function updateStatus(id, status) {
    try {
      setUpdating(id);
      const tx = await contract.updateComplaintStatus(id, status);
      await tx.wait();
      await loadComplaints();
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  }

  const statusMap = { 'All': null, 'Pending': 0, 'In Progress': 1, 'Resolved': 2 };
  const filtered = filter === 'All' ? complaints
    : complaints.filter(c => Number(c.status) === statusMap[filter]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} color="#6366f1" />
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Admin Panel</h1>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} onClick={loadComplaints}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '8px 14px', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px'
            }}>
            <RefreshCw size={14} /> Refresh
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                border: filter === f ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--border)',
                background: filter === f ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                color: filter === f ? '#6366f1' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}>{f} {filter === f && `(${filtered.length})`}
            </button>
          ))}
        </div>

        {/* Complaints with update controls */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((c, i) => (
              <div key={i}>
                <ComplaintCard complaint={c} />
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderTop: 'none', borderRadius: '0 0 12px 12px',
                  padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Update:</span>
                  {[{ label: 'Pending', val: 0, color: '#f59e0b' },
                    { label: 'In Progress', val: 1, color: '#3b82f6' },
                    { label: 'Resolved', val: 2, color: '#10b981' }].map(s => (
                    <motion.button key={s.val} whileHover={{ scale: 1.04 }}
                      onClick={() => updateStatus(Number(c.id), s.val)}
                      disabled={Number(c.status) === s.val || updating === Number(c.id)}
                      style={{
                        padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        border: `1px solid ${s.color}40`,
                        background: Number(c.status) === s.val ? `${s.color}25` : 'transparent',
                        color: s.color, cursor: Number(c.status) === s.val ? 'default' : 'pointer',
                        opacity: updating === Number(c.id) ? 0.6 : 1,
                      }}>{updating === Number(c.id) ? '...' : s.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminPanel;
