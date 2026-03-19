import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Zap, CheckCircle, Plus, Shield } from 'lucide-react';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintCard from '../components/ComplaintCard';

function Dashboard({ contract, account, onConnectAdmin, onConnectStudent }) {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [showForm, setShowForm] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  async function loadData() {
    if (!contract) return;
    try {
      setDataLoading(true);
      const all = await contract.getAllComplaints();
      setComplaints([...all].reverse());
      const s = await contract.getStats();
      setStats({
        pending: Number(s[0]),
        inProgress: Number(s[1]),
        resolved: Number(s[2]),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [contract]);

  const statCards = [
    { label: 'Total Complaints', value: complaints.length, icon: <FileText size={20} />, color: '#6366f1' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: '#f59e0b' },
    { label: 'In Progress', value: stats.inProgress, icon: <Zap size={20} />, color: '#3b82f6' },
    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle size={20} />, color: '#10b981' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px',
          padding: '2rem', marginBottom: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Shield size={28} color="#6366f1" />
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Complaint Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Transparent • Tamper-proof • Decentralized on Ethereum
          </p>
        </div>
        {account && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'var(--gradient)', border: 'none', borderRadius: '10px',
              padding: '11px 20px', color: 'white', fontWeight: 600, fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '7px',
            }}>
            <Plus size={16} /> {showForm ? 'Close Form' : 'New Complaint'}
          </motion.button>
        )}
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.2rem',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
              <div style={{ color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Complaint Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}>
          <ComplaintForm contract={contract} onSubmitted={() => { setShowForm(false); loadData(); }} />
        </motion.div>
      )}

      {/* Not Connected */}
      {!account && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '3rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', marginBottom: '2rem',
          }}>
          <Shield size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '8px' }}>Welcome to ComplaintChain</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '14px' }}>
            Login to submit and view blockchain complaints
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={onConnectStudent}
              style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '10px', padding: '11px 24px',
                color: 'var(--accent-green)', fontWeight: 600, fontSize: '14px',
              }}>
              Login as Student
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} onClick={onConnectAdmin}
              style={{
                background: 'var(--gradient)', border: 'none',
                borderRadius: '10px', padding: '11px 24px',
                color: 'white', fontWeight: 600, fontSize: '14px',
              }}>
              Login as Admin
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Complaints List */}
      {dataLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          Loading complaints...
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            All Complaints ({complaints.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.map((c, i) => <ComplaintCard key={i} complaint={c} />)}
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
