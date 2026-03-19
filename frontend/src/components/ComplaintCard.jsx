import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle, Tag, User, EyeOff } from 'lucide-react';

const STATUS = {
  0: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={12} /> },
  1: { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <Zap size={12} /> },
  2: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle size={12} /> },
};

const CATEGORY = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Other'];

const CATEGORY_COLORS = ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

function ComplaintCard({ complaint }) {
  const status = STATUS[Number(complaint.status)];
  const category = CATEGORY[Number(complaint.category)];
  const categoryColor = CATEGORY_COLORS[Number(complaint.category)];
  const date = new Date(Number(complaint.timestamp) * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const shortAddress = complaint.isAnonymous
    ? 'Anonymous'
    : `${complaint.student.slice(0, 6)}...${complaint.student.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(99,102,241,0.4)', translateY: -2 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.2rem 1.4rem',
        transition: 'all 0.2s',
      }}>

      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

          {/* ID Badge */}
          <span style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px 8px',
          }}>#{Number(complaint.id)}</span>

          {/* Title */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {complaint.title}
          </h3>
        </div>

        {/* Status Badge */}
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

          {/* Category */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 600,
            color: categoryColor, background: `${categoryColor}15`,
            border: `1px solid ${categoryColor}30`,
            borderRadius: '6px', padding: '3px 9px',
          }}>
            <Tag size={10} /> {category}
          </span>

          {/* Anonymous */}
          {complaint.isAnonymous && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', color: 'var(--text-muted)',
              background: 'var(--bg-secondary)', borderRadius: '6px', padding: '3px 9px',
            }}>
              <EyeOff size={10} /> Anonymous
            </span>
          )}
        </div>

        {/* Address + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <User size={10} /> {shortAddress}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default ComplaintCard;
