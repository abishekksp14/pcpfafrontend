import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Issues = () => {
  const {
    issues,
    projects,
    users,
    authUser,
    fetchIssues,
    fetchProjects,
    fetchUsers,
    createIssue,
    updateIssue,
    deleteIssue,
    assignIssue,
    updateIssueStatus,
    filters,
    setFilters
  } = useAppContext();

  // Search & Filter state local overrides
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Creation form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [issueId, setIssueId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [severity, setSeverity] = useState('medium');

  // Edit / Detail modal state
  const [editingIssue, setEditingIssue] = useState(null);
  const [newCommentMessage, setNewCommentMessage] = useState('');
  const [issueComments, setIssueComments] = useState([]);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchIssues();
    fetchProjects();
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const updatedFilters = { search, status: statusFilter, priority: priorityFilter, severity: severityFilter };
    setFilters(updatedFilters);
    fetchIssues(updatedFilters);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSeverityFilter('');
    const emptyFilters = { search: '', status: '', priority: '', severity: '' };
    setFilters(emptyFilters);
    fetchIssues(emptyFilters);
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createIssue({
        issueId,
        title,
        description,
        project,
        assignedTo: assignedTo || undefined,
        reportedBy: authUser?._id,
        priority,
        severity,
        status: 'open'
      });
      setSuccess('Issue logged successfully!');
      setIssueId('');
      setTitle('');
      setDescription('');
      setProject('');
      setAssignedTo('');
      setPriority('medium');
      setSeverity('medium');
      setShowAddForm(false);
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create issue');
    }
  };

  const handleDeleteIssue = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await deleteIssue(id);
        fetchIssues();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleOpenDetails = async (issue) => {
    setEditingIssue(issue);
    setError(null);
    setSuccess(null);
    // Fetch comments for this issue
    try {
      const response = await api.get(`/comments?issue=${issue._id}`);
      setIssueComments(response.data.data || response.data || []);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  const handleAssign = async (userId) => {
    try {
      await assignIssue(editingIssue._id, userId);
      setSuccess('Assignee updated successfully');
      // Refresh issue detail view
      const updated = issues.find(i => i._id === editingIssue._id);
      if (updated) setEditingIssue(updated);
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateIssueStatus(editingIssue._id, newStatus);
      setSuccess('Status updated successfully');
      // Refresh issue detail view
      const updated = issues.find(i => i._id === editingIssue._id);
      if (updated) setEditingIssue(updated);
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentMessage.trim()) return;
    try {
      const commentPayload = {
        message: newCommentMessage,
        issueId: editingIssue._id,
        user: authUser?._id
      };
      const response = await api.post('/comments', commentPayload);
      setIssueComments([...issueComments, response.data.data]);
      setNewCommentMessage('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="issues-page-wrapper">
        <div className="page-header-row">
          <div>
            <h2>Issue Tracking</h2>
            <p className="subtitle">Manage, triage, and resolve bugs</p>
          </div>
          <button 
            data-testid="add-task-btn" 
            className="primary-btn" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '➕ Log New Issue'}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        {showAddForm && (
          <div className="premium-form-card">
            <h3>Log a New Bug / Issue</h3>
            <form onSubmit={handleCreateIssue} className="responsive-form">
              <div className="form-input-group">
                <label>Issue ID (Unique string)</label>
                <input 
                  type="text" 
                  value={issueId} 
                  onChange={(e) => setIssueId(e.target.value)} 
                  placeholder="e.g. BUG-404"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Summary / Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Short summary of the bug"
                  required
                />
              </div>

              <div className="form-input-group">
                <label>Detailed Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Steps to reproduce, environment details, logs..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row-grid">
                <div className="form-input-group">
                  <label>Project</label>
                  <select value={project} onChange={(e) => setProject(e.target.value)} required>
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-input-group">
                  <label>Assignee</label>
                  <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-input-group">
                  <label>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-input-group">
                  <label>Severity</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">Log Issue</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="filter-toolbar-premium">
          <form onSubmit={handleSearchSubmit} className="filters-form-row">
            <input 
              type="text" 
              placeholder="Search title/desc..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <div className="filter-buttons">
              <button type="submit" className="filter-btn">Filter</button>
              <button type="button" className="reset-btn" onClick={handleResetFilters}>Reset</button>
            </div>
          </form>
        </div>

        {/* Issues List Card */}
        <div className="issues-list-container">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div className="issue-card-premium" key={issue._id} onClick={() => handleOpenDetails(issue)}>
                <div className="issue-card-top">
                  <span className="issue-id">{issue.issueId}</span>
                  <div className="badges-group">
                    <span className={`priority-badge ${issue.priority}`}>{issue.priority}</span>
                    <span className={`severity-badge ${issue.severity}`}>{issue.severity}</span>
                    <span className={`status-badge-val ${issue.status}`}>{issue.status}</span>
                  </div>
                </div>
                <h3>{issue.title}</h3>
                <p className="desc-preview">{issue.description}</p>
                
                <div className="issue-card-meta">
                  <span>📁 Project: {issue.project?.title || 'N/A'}</span>
                  <span>👤 Assignee: {issue.assignedTo?.name || 'Unassigned'}</span>
                </div>
                
                <div className="issue-card-footer" onClick={(e) => e.stopPropagation()}>
                  <button className="view-detail-btn" onClick={() => handleOpenDetails(issue)}>Triage & Edit</button>
                  <button className="delete-icon-btn" onClick={() => handleDeleteIssue(issue._id)}>🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-card">
              <p>No issues found. Adjust your filters or log a new issue above.</p>
            </div>
          )}
        </div>

        {/* Detail & Edit Modal */}
        {editingIssue && (
          <div className="premium-modal-backdrop" onClick={() => setEditingIssue(null)}>
            <div className="premium-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Triage Issue: {editingIssue.issueId}</h2>
                <button className="close-modal-btn" onClick={() => setEditingIssue(null)}>✕</button>
              </div>

              <div className="modal-body-layout">
                <div className="modal-main-info">
                  <h3>{editingIssue.title}</h3>
                  <p className="description-text">{editingIssue.description}</p>
                  
                  {/* Workflow State Update & Assign Actions */}
                  <div className="workflow-actions-card">
                    <h4>Workflow Triaging</h4>
                    
                    <div className="triage-row">
                      <label>Update Status:</label>
                      <select 
                        value={editingIssue.status} 
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="testing">Testing</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="triage-row">
                      <label>Assign to Developer:</label>
                      <select 
                        value={editingIssue.assignedTo?._id || ''} 
                        onChange={(e) => handleAssign(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comment Activity Section */}
                  <div className="comments-section">
                    <h4>Activity & Comments</h4>
                    <div className="comments-list">
                      {issueComments.length > 0 ? (
                        issueComments.map((c) => (
                          <div className="comment-bubble" key={c._id}>
                            <span className="comment-user"><strong>{c.user?.name || 'User'}</strong>:</span>
                            <p className="comment-text">{c.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">No activity logs or comments found.</p>
                      )}
                    </div>
                    <form onSubmit={handleAddComment} className="comment-input-form">
                      <input 
                        type="text" 
                        placeholder="Add a comment or note..." 
                        value={newCommentMessage} 
                        onChange={(e) => setNewCommentMessage(e.target.value)}
                        required
                      />
                      <button type="submit" className="primary-btn">Comment</button>
                    </form>
                  </div>
                </div>

                <div className="modal-sidebar-info">
                  <div className="meta-card">
                    <h4>Issue Details</h4>
                    <p><strong>Project:</strong> {editingIssue.project?.title || 'N/A'}</p>
                    <p><strong>Priority:</strong> <span className={`p-val ${editingIssue.priority}`}>{editingIssue.priority}</span></p>
                    <p><strong>Severity:</strong> <span className={`s-val ${editingIssue.severity}`}>{editingIssue.severity}</span></p>
                    <p><strong>Reported By:</strong> {editingIssue.reportedBy?.name || 'N/A'}</p>
                    <p><strong>Created At:</strong> {new Date(editingIssue.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Issues;
