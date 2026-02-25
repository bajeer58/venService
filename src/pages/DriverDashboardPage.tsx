/* ─────────────────────────────────────────────
   Driver Dashboard Page.
   Shows assigned route, departure time, and passenger manifest.
   ───────────────────────────────────────────── */

import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function DriverDashboardPage() {
    const { user } = useAuth();

    // Mock data for the driver's current trip
    const tripDetails = {
        vanId: 'V-402',
        route: 'Karachi → Hyderabad',
        departure: '2:00 PM',
        date: new Date().toLocaleDateString(),
        totalSeats: 20,
        bookedSeats: 18,
    };

    const manifest = [
        { seat: '1A', name: 'Ali Khan', phone: '0300-1234567', status: 'Boarded' },
        { seat: '1B', name: 'Zainab Ahmed', phone: '0321-7654321', status: 'Pending' },
        { seat: '2A', name: 'Usman Tariq', phone: '0333-9998887', status: 'Pending' },
        { seat: '2B', name: 'Sana Malik', phone: '0345-5554443', status: 'Pending' },
        { seat: '3A', name: 'Hamza Rizvi', phone: '0312-3332221', status: 'Boarded' },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30 }}>
                <div>
                    <div className="section-label">Driver Portal</div>
                    <h2>Welcome back, <span className="hi">{user?.name || 'Driver'}</span></h2>
                </div>
                <Button variant="primary" onClick={handlePrint} className="print-hide">
                    🖨️ Print Manifest
                </Button>
            </div>

            {/* Trip Overview */}
            <Card style={{ marginBottom: 30, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
                    <div>
                        <p style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Van ID</p>
                        <h3 style={{ fontSize: 18 }}>{tripDetails.vanId}</h3>
                    </div>
                    <div>
                        <p style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Route</p>
                        <h3 style={{ fontSize: 18 }}>{tripDetails.route}</h3>
                    </div>
                    <div>
                        <p style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Departure</p>
                        <h3 style={{ fontSize: 18 }}>{tripDetails.departure}</h3>
                    </div>
                    <div>
                        <p style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Occupancy</p>
                        <h3 style={{ fontSize: 18 }}>{tripDetails.bookedSeats} / {tripDetails.totalSeats}</h3>
                    </div>
                </div>
            </Card>

            {/* Passenger Manifest */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>Passenger Manifest</h3>
                <Badge variant="info">Today: {tripDetails.date}</Badge>
            </div>

            <div style={{ background: 'var(--surface2)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '16px 24px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Seat</th>
                            <th style={{ padding: '16px 24px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Passenger Name</th>
                            <th style={{ padding: '16px 24px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Phone Number</th>
                            <th style={{ padding: '16px 24px', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manifest.map((p, i) => (
                            <tr key={i} style={{ borderBottom: i < manifest.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--blue)' }}>{p.seat}</td>
                                <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{p.name}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--muted)', fontSize: 14 }}>{p.phone}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <Badge color={p.status === 'Boarded' ? 'green' : 'amber'}>{p.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
          @media print {
            .print-hide { display: none !important; }
            .admin-sidebar { display: none !important; }
            body { background: white !important; color: black !important; padding: 0 !important; }
            #root > div { margin-left: 0 !important; padding: 0 !important; }
            .hi { color: black !important; font-weight: bold !important; font-size: 24px !important; }
            table { width: 100% !important; border: 1px solid #eee !important; }
            th { background: #f9f9f9 !important; color: #333 !important; }
            td { border-bottom: 1px solid #eee !important; color: #333 !important; }
            .badge { border: 1px solid #ddd !important; color: #333 !important; background: transparent !important; }
          }
        `}</style>
        </>
    );
}