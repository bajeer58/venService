/* ─────────────────────────────────────────────
   Export buttons for CSV and PDF downloads.
   ───────────────────────────────────────────── */

import { useToast } from '../../context/ToastContext';
import { exportManifestCSV } from '../../services/bookingService';
import { MANIFEST_DATA } from '../../utils/constants';
import Button from '../ui/Button';

export default function ExportButtons() {
  const { showToast } = useToast();

  function handleExportCSV() {
    const csv = exportManifestCSV(MANIFEST_DATA);
    // Create a downloadable blob
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Manifest exported as CSV! 📥');
  }

  function handleExportPDF() {
    // In production, this would generate a real PDF
    showToast('Manifest exported as PDF! 📥');
  }

  function handlePrint() {
    showToast('Manifest sent to printer! 🖨️');
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="ghost" onClick={handleExportCSV} style={{ fontSize: 12, padding: '7px 14px' }}>
        📥 Export CSV
      </Button>
      <Button variant="ghost" onClick={handleExportPDF} style={{ fontSize: 12, padding: '7px 14px' }}>
        📥 Export PDF
      </Button>
      <Button variant="ghost" onClick={handlePrint} style={{ fontSize: 12, padding: '7px 14px' }}>
        🖨️ Print
      </Button>
    </div>
  );
}
