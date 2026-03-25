import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle, Tag, User, EyeOff, ThumbsUp } from 'lucide-react';
import ComplaintHistory from './ComplaintHistory';

const STATUS = {
  0: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={12} /> },
  1: { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <Zap size={12} /> },
  2: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle size={12} /> },
};

const CATEGORY = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Other'];
const CATEGORY_COLORS = ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

function ComplaintCard({ complaint, contract, isAdmin, voteCount: initialVoteCount = 0, onVoted }) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const status = STATUS[Number(complaint.status)];
  const category = CATEGORY[Number(complaint.category)];
  const categoryColor = CATEGORY_COLORS[Number(complaint.category)];
  const isResolved = Number(complaint.status) === 2;

  const date = new Date(Number(complaint.timestamp) * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const shortAddress = complaint.isAnonymous
    ? 'Anonymous'
    : `${complaint.student.slice(0, 6)}...${complaint.student.slice(-4)}`;

  useEffect(() => {
    if (!contract) return;
    async function loadVotes() {
      try {
        const did = await contract.didIVote(complaint.id);
        setVoted(did);
      } catch (err) { console.error(err); }
    }
    loadVotes();
  }, [contract, complaint.id]);

  async function handleUpvote() {
    if (!contract || voted || isResolved || isAdmin) return;
    try {
      setVoting(true);
      const tx = await contract.upvoteComplaint(complaint.id);
      await tx.wait();
      setVoteCount(v => v + 1);
      setVoted(true);
      if (onVoted) onVoted(Number(complaint.id));
    } catch (err) { console.error(err);
      alert("Upvote failed: " + (err?.reason || err?.message || "Unknown error"));
    }
    finally { setVoting(false); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(99,102,241,0.4)', y: -2, boxShadow: '0 8px 30px rgba(99,102,241,0.1)' }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: contract ? '12px 12px 0 0' : '12px',
        padding: '1.2rem 1.4rem',
        transition: 'all 0.2s',
      }}>

      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px 8px',
          }}>#{Number(complaint.id)}</span>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {complaint.title}
          </h3>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600,
          color: status.color, background: status.bg,
          border: `1px solid ${status.color}40`,
          borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          {status.icon} {status.label}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '13px', color: 'var(--text-secondary)',
        marginBottom: '12px', lineHeight: 1.6,
      }}>
        {complaint.description}
      </p>

      {/* Bottom Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 600,
            color: categoryColor, background: `${categoryColor}15`,
            border: `1px solid ${categoryColor}30`,
            borderRadius: '6px', padding: '3px 9px',
          }}>
            <Tag size={10} /> {category}
          </span>
          {complaint.isAnonymous && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', color: 'var(--text-muted)',
              background: 'var(--bg-secondary)', borderRadius: '6px', padding: '3px 9px',
            }}>
              <EyeOff size={10} /> Anonymous
            </span>
          )}

          {/* Upvote Button */}
          {!isAdmin && (
            <motion.button
              whileHover={{ scale: voted || isResolved ? 1 : 1.05 }}
              whileTap={{ scale: voted || isResolved ? 1 : 0.95 }}
              onClick={handleUpvote}
              disabled={voted || isResolved || voting}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontWeight: 600,
                color: voted ? '#6366f1' : 'var(--text-muted)',
                background: voted ? 'rgba(99,102,241,0.12)' : 'var(--bg-secondary)',
                border: `1px solid ${voted ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                borderRadius: '6px', padding: '3px 9px',
                cursor: voted || isResolved ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}>
              <ThumbsUp size={10} />
              {voting ? '...' : voteCount}
              {voted && ' ✓'}
            </motion.button>
          )}

          {/* Admin sees vote count but can't vote */}
          {isAdmin && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', color: '#6366f1',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '6px', padding: '3px 9px',
            }}>
              <ThumbsUp size={10} /> {voteCount} votes
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <User size={10} /> {shortAddress}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{date}</span>
        </div>
      </div>

      {/* Audit Trail */}
      {contract && (
        <ComplaintHistory
          complaintId={Number(complaint.id)}
          contract={contract}
        />
      )}

    </motion.div>
  );
}

export default ComplaintCard;
