import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Users = () => {
  const {
    users,
    fetchUsers
  } = useAppContext();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [department, setDepartment] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = { userId, name, email, role, department, password };
      await api.post('/auth/register', payload);
      setSuccess('User created successfully!');
      setUserId('');
      setName('');
      setEmail('');
      setPassword('');
      setRole('developer');
      setDepartment('');
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    }
  };

  return (
    <Layout>
      <div className="users-page-wrapper">
        <div className="page-header-row">
          <div>
            <h2>User Directory</h2>
            <p className="subtitle">View and register project members</p>
          </div>
          <button className="primary-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '➕ Add New User'}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        {showAddForm && (
          <div className="premium-form-card">
            <h3>Register New User</h3>
            <form onSubmit={handleCreateUser} className="responsive-form">
              <div className="form-input-group">
                <label>User ID (Unique)</label>
                <input 
                  type="text" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)} 
                  placeholder="e.g. USR102"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="tester">Tester</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-input-group">
                <label>Department</label>
                <input 
                  type="text" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  placeholder="e.g. Platform, Backend"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">Create User</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="users-table-card">
          <div className="table-responsive">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td><strong>{user.userId}</strong></td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td>
                        <span className={`status-badge-dot ${user.status}`}>
                          {user.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
