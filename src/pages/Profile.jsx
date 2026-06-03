import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const Profile = () => {
  const { authUser } = useAppContext();

  return (
    <Layout>
      <div className="profile-page-wrapper">
        <div className="page-header-row">
          <div>
            <h2>User Profile</h2>
            <p className="subtitle">Manage and view your credentials</p>
          </div>
        </div>

        {authUser ? (
          <div className="profile-card-premium">
            <div className="profile-avatar-large">
              {authUser.name?.charAt(0).toUpperCase()}
            </div>
            
            <div className="profile-details-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{authUser.name}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{authUser.email}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">User ID / Registration No.</span>
                <span className="detail-value">{authUser.userId}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Assigned Role</span>
                <span className={`detail-value role-val ${authUser.role}`}>{authUser.role?.toUpperCase()}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{authUser.department || 'General Development'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Account Status</span>
                <span className="detail-value text-green">🟢 ACTIVE</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state-card">
            <p>Loading profile information...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
