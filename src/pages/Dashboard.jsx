import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const {
    analytics,
    loading,
    fetchAnalytics,
    syncData,
    token
  } = useAppContext();

  const [studentId, setStudentId] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showSyncForm, setShowSyncForm] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(null);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const response = await syncData({
        studentId,
        password: syncPassword,
        token
      });
      setSyncSuccess(`Sync completed successfully! ${response.message || ''}`);
      setStudentId('');
      setSyncPassword('');
      setShowSyncForm(false);
      await fetchAnalytics();
    } catch (err) {
      setSyncError(err.response?.data?.message || err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleQuickSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const response = await syncData({ token });
      setSyncSuccess(`Sync completed successfully! ${response.message || ''}`);
      await fetchAnalytics();
    } catch (err) {
      setSyncError(err.response?.data?.message || err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const issueStats = analytics?.issues || {
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    closedIssues: 0
  };

  return (
    <Layout>
      <div className="dashboard-content-wrapper">
        <div className="page-header-row">
          <div>
            <h2>Analytics Dashboard</h2>
            <p className="subtitle">Real-time statistics & syncing tool</p>
          </div>
          <div className="sync-actions-group">
            <button 
              className="quick-sync-btn"
              onClick={handleQuickSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : '⚡ Quick Sync'}
            </button>
            <button 
              className="sync-dataset-btn"
              onClick={() => setShowSyncForm(!showSyncForm)}
              disabled={syncing}
            >
              🔑 Sync via Credentials
            </button>
          </div>
        </div>

        {syncSuccess && <div className="success-banner">{syncSuccess}</div>}
        {syncError && <div className="error-banner">{syncError}</div>}

        {showSyncForm && (
          <div className="sync-credentials-card">
            <h3>Sync Dataset from External API</h3>
            <form onSubmit={handleSyncSubmit} className="sync-form">
              <div className="form-input-group">
                <label>Student ID (Register Number)</label>
                <input 
                  type="text" 
                  value={studentId} 
                  onChange={(e) => setStudentId(e.target.value)} 
                  placeholder="e.g. 2100XXXX"
                  required
                />
              </div>
              <div className="form-input-group">
                <label>External Password</label>
                <input 
                  type="password" 
                  value={syncPassword} 
                  onChange={(e) => setSyncPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="sync-form-actions">
                <button type="submit" className="primary-btn" disabled={syncing}>
                  {syncing ? 'Synchronizing...' : 'Start Synchronization'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowSyncForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards Row */}
        <div className="stats-dashboard-grid">
          <div className="stats-card total">
            <div className="card-icon">📂</div>
            <div className="card-data">
              <span className="card-label">Total Issues</span>
              <span className="card-value">{issueStats.totalIssues}</span>
            </div>
          </div>
          <div className="stats-card open">
            <div className="card-icon">⭕</div>
            <div className="card-data">
              <span className="card-label">Open Issues</span>
              <span className="card-value">{issueStats.openIssues}</span>
            </div>
          </div>
          <div className="stats-card resolved">
            <div className="card-icon">✅</div>
            <div className="card-data">
              <span className="card-label">Resolved Issues</span>
              <span className="card-value">{issueStats.resolvedIssues}</span>
            </div>
          </div>
          <div className="stats-card closed">
            <div className="card-icon">🔒</div>
            <div className="card-data">
              <span className="card-label">Closed Issues</span>
              <span className="card-value">{issueStats.closedIssues}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="dashboard-charts-row">
          {/* Projects Breakdown */}
          <div className="dashboard-chart-card">
            <h3>Projects Breakdown</h3>
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Issue Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.projects?.length > 0 ? (
                    analytics.projects.map((p, idx) => (
                      <tr key={idx}>
                        <td><strong>{p.project}</strong></td>
                        <td><span className="badge-issue-count">{p.issueCount}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">No projects found. Please run Sync first.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Developer Performance */}
          <div className="dashboard-chart-card">
            <h3>Developer Performance</h3>
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Resolved Issues</th>
                    <th>Avg Resolution Time (Days)</th>
                    <th>Highest Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.developers?.length > 0 ? (
                    analytics.developers.map((d, idx) => (
                      <tr key={idx}>
                        <td><strong>{d.developer}</strong></td>
                        <td>{d.resolvedIssues}</td>
                        <td>{d.averageResolutionTime}</td>
                        <td>{d.highestResolvedIssueCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No developers found. Please run Sync first.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
