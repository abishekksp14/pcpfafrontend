import { describe, it, expect } from 'vitest';
import { taskReducer, initialState } from './taskReducer';

describe('taskReducer tests', () => {
  it('should return initial state when action is unknown', () => {
    expect(taskReducer(initialState, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const user = { userId: 'USR101', name: 'John Doe' };
    const action = { type: 'LOGIN_SUCCESS', payload: { token: 'jwt_token', user } };
    const state = taskReducer(initialState, action);
    expect(state.token).toBe('jwt_token');
    expect(state.authUser).toEqual(user);
  });

  it('should handle LOGOUT', () => {
    const loggedInState = {
      ...initialState,
      token: 'some_token',
      authUser: { userId: '123' }
    };
    const state = taskReducer(loggedInState, { type: 'LOGOUT' });
    expect(state.token).toBeNull();
    expect(state.authUser).toBeNull();
  });

  it('should handle SET_USERS', () => {
    const users = [{ _id: '1', name: 'User 1' }];
    const state = taskReducer(initialState, { type: 'SET_USERS', payload: users });
    expect(state.users).toEqual(users);
  });

  it('should handle SET_PROJECTS', () => {
    const projects = [{ _id: '1', title: 'Proj 1' }];
    const state = taskReducer(initialState, { type: 'SET_PROJECTS', payload: projects });
    expect(state.projects).toEqual(projects);
  });

  it('should handle SET_ISSUES', () => {
    const issues = [{ _id: '1', title: 'Issue 1' }];
    const state = taskReducer(initialState, { type: 'SET_ISSUES', payload: issues });
    expect(state.issues).toEqual(issues);
  });

  it('should handle ADD_ISSUE', () => {
    const existingIssues = [{ _id: '1', title: 'Issue 1' }];
    const stateWithIssues = { ...initialState, issues: existingIssues };
    const newIssue = { _id: '2', title: 'Issue 2' };
    const state = taskReducer(stateWithIssues, { type: 'ADD_ISSUE', payload: newIssue });
    expect(state.issues).toEqual([newIssue, ...existingIssues]);
  });

  it('should handle UPDATE_ISSUE', () => {
    const existingIssues = [{ _id: '1', title: 'Issue 1' }, { _id: '2', title: 'Issue 2' }];
    const stateWithIssues = { ...initialState, issues: existingIssues };
    const updatedIssue = { _id: '2', title: 'Issue 2 Updated' };
    const state = taskReducer(stateWithIssues, { type: 'UPDATE_ISSUE', payload: updatedIssue });
    expect(state.issues[1]).toEqual(updatedIssue);
  });

  it('should handle DELETE_ISSUE', () => {
    const existingIssues = [{ _id: '1', title: 'Issue 1' }, { _id: '2', title: 'Issue 2' }];
    const stateWithIssues = { ...initialState, issues: existingIssues };
    const state = taskReducer(stateWithIssues, { type: 'DELETE_ISSUE', payload: '1' });
    expect(state.issues).toEqual([{ _id: '2', title: 'Issue 2' }]);
  });
});
