import { describe, it, expect } from 'vitest';
import { sanitizeIssue } from './sanitizer';

describe('sanitizeIssue tests', () => {
  it('should return null for null or non-object input', () => {
    expect(sanitizeIssue(null)).toBeNull();
    expect(sanitizeIssue('string')).toBeNull();
  });

  it('should return null if issueId (or id) is missing', () => {
    const invalidIssue = { title: 'No ID', description: 'desc' };
    expect(sanitizeIssue(invalidIssue)).toBeNull();
  });

  it('should return null if title is missing', () => {
    const invalidIssue = { issueId: 'ISS-1', description: 'desc' };
    expect(sanitizeIssue(invalidIssue)).toBeNull();
  });

  it('should sanitize a valid issue object', () => {
    const issue = {
      issueId: 'ISS-1',
      title: 'Valid title',
      description: 'desc',
      status: 'in-progress',
      priority: 'high',
      severity: 'critical'
    };
    const sanitized = sanitizeIssue(issue);
    expect(sanitized).toEqual({
      issueId: 'ISS-1',
      title: 'Valid title',
      description: 'desc',
      status: 'in-progress',
      priority: 'high',
      severity: 'critical'
    });
  });

  it('should use id field if issueId is not present', () => {
    const issue = {
      id: 'ISS-2',
      title: 'Valid title'
    };
    const sanitized = sanitizeIssue(issue);
    expect(sanitized.issueId).toBe('ISS-2');
  });

  it('should trim whitespace from issueId and title', () => {
    const issue = {
      issueId: '  ISS-3  ',
      title: '  Trimmed title  '
    };
    const sanitized = sanitizeIssue(issue);
    expect(sanitized.issueId).toBe('ISS-3');
    expect(sanitized.title).toBe('Trimmed title');
  });

  it('should fall back to defaults for status, priority, and severity if missing/invalid', () => {
    const issue = {
      issueId: 'ISS-4',
      title: 'Title',
      status: 'invalid-status',
      priority: 'invalid-priority',
      severity: 'invalid-severity'
    };
    const sanitized = sanitizeIssue(issue);
    expect(sanitized.status).toBe('open');
    expect(sanitized.priority).toBe('medium');
    expect(sanitized.severity).toBe('medium');
  });

  it('should map completed to resolved and pending to open', () => {
    const issue1 = { issueId: '1', title: 'T', status: 'completed' };
    const issue2 = { issueId: '2', title: 'T', status: 'pending' };
    expect(sanitizeIssue(issue1).status).toBe('resolved');
    expect(sanitizeIssue(issue2).status).toBe('open');
  });
});
