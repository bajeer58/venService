/* ─────────────────────────────────────────────
   Admin Dashboard page.
   KPIs, charts, routes, activity log, and staff panel.
   ───────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchKPIs, fetchWeeklyBookings,
  fetchRouteDistribution, fetchActivityLog,
} from '../services/dashboardService';
import type { KpiCard, WeeklyBooking, RouteDistribution, ActivityLogEntry } from '../types';
import RevenueCards from '../components/dashboard/RevenueCards';
import BookingChart from '../components/dashboard/BookingChart';
import RouteTable from '../components/dashboard/RouteTable';
import ActivityLog from '../components/dashboard/ActivityLog';
import StaffPanel from '../components/dashboard/StaffPanel';
import BIDashboard from '../components/dashboard/BIDashboard';

type DashTab = 'admin' | 'staff' | 'bi';

export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as DashTab) || 'admin';
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard data
  const [kpis, setKpis] = useState<KpiCard[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyBooking[]>([]);
  const [routeData, setRouteData] = useState<RouteDistribution[]>([]);
  const [activityData, setActivityData] = useState<ActivityLogEntry[]>([]);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [k, w, r, a] = await Promise.all([
        fetchKPIs(),
        fetchWeeklyBookings(),
        fetchRouteDistribution(),
        fetchActivityLog(),
      ]);
      setKpis(k);
      setWeeklyData(w);
      setRouteData(r);
      setActivityData(a);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleTabChange = (tab: DashTab) => {
    setSearchParams({ tab });
  };

  return (
    <>
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Operations Center
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Powerful <span className="hi">Dashboards</span>
      </motion.h2>
      <motion.p
        className="section-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Full control for admins and staff. Real-time data, printable manifests, and deep analytics.
      </motion.p>

      {/* Tab switcher */}
      <div className="dash-tabs" style={{ marginTop: 28, marginBottom: 28 }}>
        <button
          className={`dash-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => handleTabChange('admin')}
        >
          📊 Admin Analytics
        </button>
        <button
          className={`dash-tab ${activeTab === 'bi' ? 'active' : ''}`}
          onClick={() => handleTabChange('bi')}
        >
          📈 Business Intelligence
        </button>
        <button
          className={`dash-tab ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => handleTabChange('staff')}
        >
          🖥️ Staff Counter
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <RevenueCards data={kpis} isLoading={isLoading} />
            <BookingChart
              weeklyData={weeklyData}
              routeData={routeData}
              isLoading={isLoading}
            />
            <div style={{ marginTop: 24 }}>
              <RouteTable />
            </div>
            <div style={{ marginTop: 24 }}>
              <ActivityLog entries={activityData} isLoading={isLoading} />
            </div>
          </motion.div>
        )}

        {activeTab === 'bi' && (
          <motion.div
            key="bi"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <BIDashboard />
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div
            key="staff"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <StaffPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
