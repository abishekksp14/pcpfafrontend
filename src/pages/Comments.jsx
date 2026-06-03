import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';

const Comments = () => {
  const {
    comments,
    fetchComments,
    deleteComment
  } = useAppContext();

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(id);
        fetchComments();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <Layout>
      <div className="comments-page-wrapper">
        <div className="page-header-row">
          <div>
            <h2>Comment & Activity Stream</h2>
            <p className="subtitle">Track collaboration activity logs across issues</p>
          </div>
        </div>

        <div className="comments-activity-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div className="activity-card-premium" key={comment._id}>
                <div className="activity-card-header">
                  <span className="comment-author-badge">
                    👤 {comment.user?.name || 'Unknown User'} ({comment.user?.role || 'developer'})
                  </span>
                  <span className="comment-timestamp">
                    📅 {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="activity-card-body">
                  <p className="message-text">"{comment.message}"</p>
                  <p className="issue-reference">
                    🐛 Ref Issue: <strong>{comment.issue?.issueId || 'N/A'}</strong> - {comment.issue?.title || 'N/A'}
                  </p>
                </div>
                <div className="activity-card-footer">
                  <button 
                    className="danger-btn-small" 
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-card">
              <p>No activity logs or comments found in the stream.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Comments;
