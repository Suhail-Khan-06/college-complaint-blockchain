import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';

function MyComplaints({ contract, account, isAdmin }) {
  const [complaints, setComplaints] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!contract) return;
      try {
        setLoading(true);
        const mine = await contract.getMyComplaints();
        setComplaints([...mine].reverse());

        const counts = {};
        for (let c of mine) {
          const v = await contract.upvotes(c.id);
          counts[Number(c.id)] = Number(v);
        }
        setVoteCounts(counts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [contract]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <FileText size={24} color="#6366f1" />
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>My Complaints</h1>
          <span style={{
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '20px', padding: '2px 10px', fontSize: '12px', color: '#6366f1', fontWeight: 600
          }}>{complaints.length}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading...</div>
        ) : complaints.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: '16px',
          }}>
            <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.map((c, i) => (
              <ComplaintCard
                key={i}
                complaint={c}
                contract={contract}
                isAdmin={false}
                voteCount={voteCounts[Number(c.id)] || 0}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default MyComplaints;
