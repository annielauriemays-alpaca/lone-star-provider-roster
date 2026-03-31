import { useState } from 'react';

const PAYERS = ['TMHP (TX Medicaid)', 'BCBS of TX', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Scott & White', 'Molina Healthcare'];

const PROVIDERS = [
  {
    name: 'Dr. Sandra Reyes', npi: '1234567890', cred: 'Psychologist',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Enrolled' },
      'Aetna': { status: 'Issue', title: 'NPI mismatch on file', description: 'Aetna\'s credentialing record reflects an old group NPI. Claims are routing incorrectly and returning CO-4. The rendering NPI on file does not match the billing NPI submitted on claims.', action: 'Submit NPI update form to Aetna credentialing. Audit all open Aetna claims for this provider and resubmit with corrected NPI pairing.' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Not contracted' },
      'Scott & White': { status: 'Not contracted' },
      'Molina Healthcare': { status: 'Enrolled' },
    }
  },
  {
    name: 'Marcus Webb', npi: '1987654321', cred: 'LCSW',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Blocked', title: 'Provider excluded from TMHP', description: 'This provider appears on the OIG exclusion list. TMHP has suspended billing privileges pending review. All claims submitted under this NPI are being returned without payment.', action: 'Do not submit any TMHP claims under this NPI. Engage compliance immediately. Provider must resolve OIG exclusion before reinstatement.' },
      'BCBS of TX': { status: 'Issue', title: 'Credentialing application incomplete', description: 'BCBS of TX returned the credentialing application citing missing malpractice insurance documentation. Provider is in a pending status and claims are being held.', action: 'Obtain current malpractice certificate and resubmit to BCBS credentialing. Follow up every 5 business days until status is confirmed.' },
      'Aetna': { status: 'Not contracted' },
      'Cigna': { status: 'Not contracted' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Not contracted' },
      'Molina Healthcare': { status: 'Not contracted' },
    }
  },
  {
    name: 'Priya Anand', npi: '1654321098', cred: 'LPC',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Enrolled' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Enrolled' },
      'Molina Healthcare': { status: 'Enrolled' },
    }
  },
  {
    name: 'James Okafor', npi: '1456789012', cred: 'LMFT',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Issue', title: 'Taxonomy code mismatch', description: 'TMHP records show an outdated taxonomy code for this provider. Claims are rejecting with CO-97 — benefit for this service is included in payment for another service already adjudicated. Root cause is taxonomy mismatch between enrollment record and claim submission.', action: 'File a provider file maintenance request with TMHP to update taxonomy code to 101YM0800X. Resubmit affected claims after confirmation of update.' },
      'BCBS of TX': { status: 'Not contracted' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Issue', title: 'Rate agreement expired', description: 'This provider\'s fee schedule agreement with Cigna expired 90 days ago. Claims are processing at default rates which are significantly below contracted rates, causing underpayment.', action: 'Contact Cigna provider relations to initiate rate agreement renewal. Flag all claims processed in the last 90 days for underpayment review and reprocess once new agreement is in place.' },
      'UnitedHealthcare': { status: 'Not contracted' },
      'Scott & White': { status: 'Enrolled' },
      'Molina Healthcare': { status: 'Not contracted' },
    }
  },
  {
    name: 'Tanya Flores', npi: '1789012345', cred: 'LPC',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Not contracted' },
      'BCBS of TX': { status: 'Blocked', title: 'License under disciplinary review', description: 'BCBS of TX has suspended this provider\'s participation pending resolution of a Texas State Board of Examiners of Professional Counselors disciplinary inquiry. All claims under this NPI are being denied.', action: 'Pause scheduling for BCBS patients. Do not submit BCBS claims under this NPI until board inquiry is resolved. Notify compliance and legal.' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Issue', title: 'Missing W-9 on file', description: 'UnitedHealthcare is holding payments for this provider due to a missing or expired W-9. Claims are adjudicating but payments are being withheld pending tax documentation.', action: 'Submit updated W-9 directly to UHC provider relations. Confirm receipt and request release of withheld payments once on file.' },
      'Scott & White': { status: 'Not contracted' },
      'Molina Healthcare': { status: 'Enrolled' },
    }
  },
  {
    name: 'Derek Nguyen', npi: '1890123456', cred: 'Psychologist',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Enrolled' },
      'Aetna': { status: 'Not contracted' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Issue', title: 'Credentialing pending — 60+ days', description: 'This provider\'s credentialing application with Scott & White has been pending for over 60 days with no determination. Claims submitted during this period are being denied as provider not credentialed.', action: 'Escalate to Scott & White credentialing supervisor. Request expedited review. Do not schedule S&W patients until credentialing is confirmed.' },
      'Molina Healthcare': { status: 'Not contracted' },
    }
  },
  {
    name: 'Carla Hutchins', npi: '1901234567', cred: 'LCSW',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Issue', title: 'Group vs individual NPI conflict', description: 'Claims are being submitted under the individual NPI but BCBS requires billing under the group NPI for this provider type. Claims are returning CO-4 (service not covered by this payer/contractor).', action: 'Update billing configuration to use group NPI for all BCBS claims. Resubmit denied claims under the group NPI within timely filing window.' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Not contracted' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Enrolled' },
      'Molina Healthcare': { status: 'Issue', title: 'Enrollment application returned', description: 'Molina returned the enrollment application citing an invalid CAQH profile link. The CAQH profile was not attested within the required 120-day window and has expired.', action: 'Re-attest CAQH profile immediately. Resubmit Molina enrollment application with updated CAQH ID. Allow 30-45 days for processing.' },
    }
  },
  {
    name: 'Anthony Bell', npi: '1012345678', cred: 'LMFT',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Not contracted' },
      'BCBS of TX': { status: 'Enrolled' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Blocked', title: 'Credentialing terminated by payer', description: 'Cigna terminated this provider\'s participation agreement following a pattern of claims submitted with incorrect place of service codes. Telehealth claims were billed with POS 11 (office) instead of POS 02 (telehealth), triggering a compliance review.', action: 'Do not submit Cigna claims under this NPI. Engage Cigna provider relations regarding reinstatement process. Conduct internal audit of all telehealth billing for this provider.' },
      'UnitedHealthcare': { status: 'Not contracted' },
      'Scott & White': { status: 'Enrolled' },
      'Molina Healthcare': { status: 'Not contracted' },
    }
  },
  {
    name: 'Lisa Tran', npi: '1123456789', cred: 'LPC',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Not contracted' },
      'Aetna': { status: 'Issue', title: 'Supervisory relationship not on file', description: 'Aetna requires documented supervisory agreements for provisionally licensed providers. This provider\'s supervision agreement was not submitted during credentialing and claims are denying as provider not eligible.', action: 'Submit supervisory agreement documentation to Aetna credentialing. Include supervisor NPI and license number. Follow up within 10 business days.' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Not contracted' },
      'Molina Healthcare': { status: 'Enrolled' },
    }
  },
  {
    name: 'Robert Kim', npi: '1234509876', cred: 'Psychologist',
    payers: {
      'TMHP (TX Medicaid)': { status: 'Enrolled' },
      'BCBS of TX': { status: 'Enrolled' },
      'Aetna': { status: 'Enrolled' },
      'Cigna': { status: 'Enrolled' },
      'UnitedHealthcare': { status: 'Enrolled' },
      'Scott & White': { status: 'Enrolled' },
      'Molina Healthcare': { status: 'Enrolled' },
    }
  },
];

const statusColors = {
  Enrolled: { bg: '#eaf3de', color: '#3b6d11', dot: '#3b6d11' },
  Issue: { bg: '#faeeda', color: '#854f0b', dot: '#c67d14' },
  Blocked: { bg: '#fcebeb', color: '#791f1f', dot: '#c0392b' },
  'Not contracted': { bg: '#f1efe8', color: '#5f5e5a', dot: '#b4b2a9' },
};

const s = {
  app: { minHeight: '100vh' },
  navbar: { background: '#fff', borderBottom: '1px solid #e5e5e2', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 52 },
  brand: { fontWeight: 600, fontSize: 14, color: '#1a1a1a' },
  brandSub: { fontSize: 13, color: '#888780' },
  main: { padding: '2rem', maxWidth: 1300, margin: '0 auto' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' },
  kpiCard: { background: '#fff', border: '1px solid #e5e5e2', borderRadius: 8, padding: '1rem 1.25rem' },
  kpiLabel: { fontSize: 12, color: '#888780', marginBottom: 6 },
  toolbar: { display: 'flex', gap: 10, marginBottom: '1.25rem', alignItems: 'center' },
  searchInput: { flex: 1, padding: '8px 12px', border: '0.5px solid rgba(0,0,0,0.2)', borderRadius: 6, fontSize: 13, background: '#fff', color: '#1a1a1a', outline: 'none' },
  filterBtn: { padding: '6px 14px', fontSize: 13, borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.2)', background: 'transparent', cursor: 'pointer', color: '#5f5e5a' },
  filterBtnActive: { padding: '6px 14px', fontSize: 13, borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.2)', background: '#1a1a1a', cursor: 'pointer', color: '#fff' },
  tableWrap: { overflowX: 'auto', background: '#fff', border: '1px solid #e5e5e2', borderRadius: 8 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#888780', padding: '10px 14px', borderBottom: '1px solid #e5e5e2', whiteSpace: 'nowrap' },
  td: { padding: '12px 14px', borderBottom: '1px solid #f0efea', verticalAlign: 'middle' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '3px 9px', borderRadius: 99, fontWeight: 500, whiteSpace: 'nowrap' },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 12, padding: '2rem', maxWidth: 560, width: '90%', position: 'relative' },
  modalHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
  modalPayer: { fontSize: 16, fontWeight: 600 },
  modalSub: { fontSize: 13, color: '#888780', marginBottom: '1rem' },
  modalTitle: { fontSize: 15, fontWeight: 600, marginBottom: 8 },
  modalDesc: { fontSize: 13, color: '#5f5e5a', lineHeight: 1.6, marginBottom: '1rem' },
  actionBox: { background: '#faeeda', border: '1px solid #f5c47a', borderRadius: 8, padding: '1rem' },
  actionLabel: { fontSize: 11, fontWeight: 600, color: '#854f0b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 },
  actionText: { fontSize: 13, color: '#5f5e5a', lineHeight: 1.6 },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888780', padding: 4 },
};

export default function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(null);

  const getProviderStatus = (provider) => {
    const statuses = Object.values(provider.payers).map(p => p.status);
    if (statuses.includes('Blocked')) return 'Blocked';
    if (statuses.includes('Issue')) return 'Issues';
    if (statuses.every(s => s === 'Enrolled' || s === 'Not contracted')) return 'Clean';
    return 'Clean';
  };

  const filtered = PROVIDERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.npi.includes(search);
    const status = getProviderStatus(p);
    const matchFilter = filter === 'All' || filter === status || (filter === 'Issues' && status === 'Issues');
    return matchSearch && matchFilter;
  });

  const totalBlocked = PROVIDERS.filter(p => getProviderStatus(p) === 'Blocked').length;
  const totalIssues = PROVIDERS.filter(p => getProviderStatus(p) === 'Issues').length;
  const totalClean = PROVIDERS.filter(p => getProviderStatus(p) === 'Clean').length;

  const flagCount = (provider) => {
    const flags = Object.values(provider.payers).filter(p => p.status === 'Issue' || p.status === 'Blocked').length;
    return flags;
  };

  return (
    <div style={s.app}>
      <nav style={s.navbar}>
        <span style={s.brand}>Lone Star Behavioral Group</span>
        <span style={s.brandSub}>Provider Credentialing Roster · Austin, TX</span>
      </nav>

      <main style={s.main}>
        <div style={s.kpiGrid}>
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>Total providers</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{PROVIDERS.length}</div>
          </div>
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>Blocked</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#c0392b' }}>{totalBlocked}</div>
          </div>
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>Active issues</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#c67d14' }}>{totalIssues}</div>
          </div>
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>Clean</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#3b6d11' }}>{totalClean}</div>
          </div>
        </div>

        <div style={s.toolbar}>
          <input
            style={s.searchInput}
            placeholder="Search by name or NPI..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {['All', 'Issues', 'Blocked', 'Clean'].map(f => (
            <button key={f} style={filter === f ? s.filterBtnActive : s.filterBtn} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Provider / NPI</th>
                {PAYERS.map(p => <th key={p} style={s.th}>{p}</th>)}
                <th style={s.th}>Flags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(provider => {
                const flags = flagCount(provider);
                const provStatus = getProviderStatus(provider);
                return (
                  <tr key={provider.npi}>
                    <td style={s.td}>
                      <div style={{ fontWeight: 500 }}>{provider.name}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{provider.npi} · {provider.cred}</div>
                    </td>
                    {PAYERS.map(payer => {
                      const entry = provider.payers[payer];
                      const sc = statusColors[entry.status];
                      const clickable = entry.status === 'Issue' || entry.status === 'Blocked';
                      return (
                        <td key={payer} style={s.td}>
                          <span
                            style={{ ...s.badge, background: sc.bg, color: sc.color, cursor: clickable ? 'pointer' : 'default', textDecoration: clickable ? 'underline' : 'none', textDecorationStyle: 'dotted' }}
                            onClick={() => clickable && setModal({ payer, provider, entry })}
                          >
                            <span style={{ ...s.dot, background: sc.dot }} />
                            {entry.status}
                          </span>
                        </td>
                      );
                    })}
                    <td style={s.td}>
                      {flags > 0 ? (
                        <span style={{ ...s.badge, background: provStatus === 'Blocked' ? '#fcebeb' : '#faeeda', color: provStatus === 'Blocked' ? '#791f1f' : '#854f0b' }}>
                          {flags} {flags === 1 ? 'flag' : 'flags'}
                        </span>
                      ) : (
                        <span style={{ color: '#3b6d11', fontSize: 12 }}>✓ Clean</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setModal(null)}>✕</button>
            <div style={s.modalHeader}>
              <span style={s.modalPayer}>{modal.payer}</span>
              <span style={{ ...s.badge, background: statusColors[modal.entry.status].bg, color: statusColors[modal.entry.status].color, fontSize: 11 }}>
                <span style={{ ...s.dot, background: statusColors[modal.entry.status].dot }} />
                {modal.entry.status}
              </span>
            </div>
            <div style={s.modalSub}>{modal.provider.name} · {modal.provider.npi}</div>
            <div style={s.modalTitle}>{modal.entry.title}</div>
            <div style={s.modalDesc}>{modal.entry.description}</div>
            <div style={s.actionBox}>
              <div style={s.actionLabel}>Required action</div>
              <div style={s.actionText}>{modal.entry.action}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
