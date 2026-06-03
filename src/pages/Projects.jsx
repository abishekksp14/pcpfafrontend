import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const Projects = () => {
  const {
    projects,
    users,
    fetchProjects,
    fetchUsers,
    createProject,
    deleteProject
  } = useAppContext();

  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('active');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createProject({
        projectId,
        title,
        description,
        owner,
        members,
        status
      });
      setSuccess('Project created successfully!');
      setProjectId('');
      setTitle('');
      setDescription('');
      setOwner('');
      setMembers([]);
      setStatus('active');
      setShowAddForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setMembers(selectedOptions);
  };

  return (
    <Layout>
      <div className="projects-page-wrapper">
        <div className="page-header-row">
          <div>
            <h2>Project Management</h2>
            <p className="subtitle">View and configure system projects</p>
          </div>
          <button className="primary-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '➕ Add New Project'}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        {showAddForm && (
          <div className="premium-form-card">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreate} className="responsive-form">
              <div className="form-input-group">
                <label>Project ID (Unique)</label>
                <input 
                  type="text" 
                  value={projectId} 
                  onChange={(e) => setProjectId(e.target.value)} 
                  placeholder="e.g. PROJ-101"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Project Title"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Project Description"
                  rows="3"
                />
              </div>

              <div className="form-input-group">
                <label>Owner</label>
                <select value={owner} onChange={(e) => setOwner(e.target.value)} required>
                  <option value="">Select Owner</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-input-group">
                <label>Members (Hold Ctrl to select multiple)</label>
                <select multiple value={members} onChange={handleMemberChange} className="multi-select">
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-input-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">Create Project</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div className="project-card-premium" key={proj._id}>
                <div className="project-card-header">
                  <span className="project-id-badge">{proj.projectId}</span>
                  <span className={`status-badge ${proj.status}`}>{proj.status}</span>
                </div>
                <h3>{proj.title}</h3>
                <p className="project-desc">{proj.description || 'No description provided.'}</p>
                
                <div className="project-meta-info">
                  <div className="meta-item">
                    <strong>Owner:</strong> {proj.owner?.name || 'N/A'}
                  </div>
                  <div className="meta-item">
                    <strong>Members:</strong> {proj.members?.length || 0} users
                  </div>
                </div>

                <div className="project-card-actions">
                  <button 
                    className="danger-outline-btn" 
                    onClick={() => handleDelete(proj._id)}
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-card">
              <p>No projects found. Use the sync function or create a project manually above.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
