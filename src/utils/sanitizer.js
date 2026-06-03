/**
 * Sanitizes and validates an Issue object.
 * Returns the sanitized object or null if invalid.
 */
export const sanitizeIssue = (issue) => {
  if (!issue || typeof issue !== 'object') {
    return null;
  }

  // Ensure issueId exists
  const issueId = (issue.issueId || issue.id || '').toString().trim();
  if (!issueId) {
    return null;
  }

  // Ensure title exists and is non-empty
  const title = (issue.title || '').toString().trim();
  if (!title) {
    return null;
  }

  // Normalize description
  const description = (issue.description || '').toString().trim();

  // Validate status (default to 'open')
  const allowedStatuses = ['open', 'in-progress', 'testing', 'resolved', 'closed'];
  let status = (issue.status || '').toString().trim().toLowerCase();
  if (status === 'completed') status = 'resolved';
  if (status === 'pending') status = 'open';
  if (!allowedStatuses.includes(status)) {
    status = 'open';
  }

  // Validate priority (default to 'medium')
  const allowedPriorities = ['low', 'medium', 'high'];
  const priority = (issue.priority || '').toString().trim().toLowerCase();
  const finalPriority = allowedPriorities.includes(priority) ? priority : 'medium';

  // Validate severity (default to 'medium')
  const allowedSeverities = ['low', 'medium', 'high', 'critical'];
  const severity = (issue.severity || '').toString().trim().toLowerCase();
  const finalSeverity = allowedSeverities.includes(severity) ? severity : 'medium';

  return {
    issueId,
    title,
    description,
    status,
    priority: finalPriority,
    severity: finalSeverity,
  };
};
