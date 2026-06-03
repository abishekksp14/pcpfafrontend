import { describe, it, expect } from 'vitest';
import { sanitizeIssue } from '../utils/sanitizer';

describe('pcpfa sanitizeIssue tests', () => {
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
});
