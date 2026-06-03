import { describe, it, expect } from 'vitest';
import { taskReducer, initialState } from '../../../src/reducer/taskReducer';

describe('pcpfa taskReducer tests', () => {
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
});
