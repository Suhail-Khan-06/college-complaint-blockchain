import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';

const CATEGORIES = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Other'];

const inputStyle = {
  width: '100%', background: 'var(--bg-secondary)',
  border: '1px solid var(--border)', borderRadius: '8px',
  padding: '10px 14px', color: 'var(--text-primary)',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};

function ComplaintForm({ contract, onSubmitted }) {
  const [form, setForm] = useState({ title: '', description: '', category: '0', isAnonymous: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    try {
      setLoading(true);
      const tx = await contract.submitComplaint(
        form.title, form.description,
        Number(form.category), form.isAnonymous
      );
      await tx.wait();
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSubmitted(); }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '16px', padding: '1.8rem',
      }}>

      <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '1.4rem', color: 'var(--text-primary)' }}>
        Submit New Complaint
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Title */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Title *
          </label>
          <input
            style={inputStyle}
            placeholder="e.g. No water supply in Block B"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Description *
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
            placeholder="Describe your complaint in detail..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Category + Anonymous Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Category
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c, i) => <option key={i} value={i}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)',
            }}>
              <div style={{
                width: '40px', height: '22px', borderRadius: '11px',
                background: form.isAnonymous ? '#6366f1' : 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
              }} onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '2px',
                  left: form.isAnonymous ? '20px' : '2px',
                  transition: 'left 0.2s',
                }} />
              </div>
              Submit Anonymously
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={loading || success}
          style={{
            background: success ? 'rgba(16,185,129,0.8)' : 'var(--gradient)',
            border: 'none', borderRadius: '10px',
            padding: '12px', color: 'white',
            fontWeight: 700, fontSize: '14px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.8 : 1,
          }}>
          {loading ? <><Loader size={16} className="spin" /> Submitting to Blockchain...</>
            : success ? '✅ Complaint Submitted!'
            : <><Send size={16} /> Submit Complaint</>}
        </motion.button>

      </form>
    </motion.div>
  );
}

export default ComplaintForm;
