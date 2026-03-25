import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Zap, CheckCircle, Plus, ArrowUpDown } from 'lucide-react';
import ComplaintCard from "../components/ComplaintCard";
import ComplaintForm from "../components/ComplaintForm";

function Dashboard({ contract, account, isAdmin }) {
  const [complaints, setComplaints] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  async function loadData() {
  if (!contract) {
    setLoading(false);
    return;
  }
  try {
    const all = await contract.getAllComplaints();
    setComplaints(all);

    // Parallel fetch all vote counts
    const promises = all.map(c => contract.upvotes(c.id));
    const votes = await Promise.all(promises);
    
    const counts = {};
    for (let i = 0; i < all.length; i++) {
      counts[Number(all[i].id)] = Number(votes[i]);
    }
    setVoteCounts(counts);

    const s = await contract.getStats();
    setStats({
      pending: Number(s.pending),
      inProgress: Number(s.inProgress),
      resolved: Number(s.resolved),
    });
  } catch (err) { console.error(err); }
  finally { setLoading(false); }
}


  useEffect(() => { loadData(); }, [contract]);

  function getSortedComplaints() {
    const arr = [...complaints];
    if (sortBy === 'most_voted') {
      return arr.sort((a, b) => (voteCounts[Number(b.id)] || 0) - (voteCounts[Number(a.id)] || 0));
    } else if (sortBy === 'oldest') {
      return arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    } else {
      return arr.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    }
  }

  const sorted = getSortedComplaints();

  const statCards = [
    { label: 'Total Complaints', value: complaints.length,  icon: <FileText size={20} />,    color: '#6366f1' },
    { label: 'Pending',          value: stats.pending,      icon: <Clock size={20} />,        color: '#f59e0b' },
    { label: 'In Progress',      value: stats.inProgress,   icon: <Zap size={20} />,          color: '#3b82f6' },
    { label: 'Resolved',         value: stats.resolved,     icon: <CheckCircle size={20} />,  color: '#10b981' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '16px', padding: '1.8rem 2rem',
          marginBottom: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            🛡️ Complaint Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Transparent • Tamper-proof • Decentralized on Ethereum
          </p>
        </div>
        {account && !isAdmin && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}>
            <Plus size={16} /> New Complaint
          </motion.button>
        )}
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.2rem',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.8 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Complaints Header + Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          All Complaints ({complaints.length})
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', borderRadius: '8px',
              padding: '6px 10px', fontSize: '13px', cursor: 'pointer', outline: 'none',
            }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_voted">Most Voted</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading...</div>
      ) : sorted.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px',
          color: 'var(--text-muted)', fontSize: '14px',
        }}>
          No complaints yet. {!isAdmin && 'Be the first to submit one!'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map((c) => (
            <ComplaintCard
              key={Number(c.id)}
              complaint={c}
              contract={contract}
              isAdmin={isAdmin}
              voteCount={voteCounts[Number(c.id)] || 0}
              onVoted={(id) => setVoteCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))}
            />
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', borderRadius: '16px',
              padding: '2rem', width: '100%', maxWidth: '500px',
              border: '1px solid var(--border)',
            }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '18px', fontWeight: 700 }}>
              🛡️ Submit New Complaint
            </h2>
            <ComplaintForm
              contract={contract}
              onSubmitted={() => { setShowModal(false); loadData(); }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
