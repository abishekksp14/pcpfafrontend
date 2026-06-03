import { createContext, useReducer, useContext, useEffect } from 'react';
import { taskReducer, initialState } from '../reducer/taskReducer';
import api from '../services/api';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Sync state to window.appState
  useEffect(() => {
    window.appState = {
      authUser: state.authUser,
      token: state.token,
      users: state.users,
      projects: state.projects,
      issues: state.issues,
      comments: state.comments,
      filters: state.filters,
      analytics: state.analytics
    };
  }, [
    state.authUser,
    state.token,
    state.users,
    state.projects,
    state.issues,
    state.comments,
    state.filters,
    state.analytics
  ]);

  // Load token on startup
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Decode or fetch current user
      api.get('/auth/me')
        .then((res) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token: storedToken, user: res.data.data }
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        });
    }
  }, []);

  // Action methods
  const loginUser = async (studentId, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/login', { userId: studentId, password });
      const { token, data: user } = response.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const registerUser = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/register', userData);
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      dispatch({ type: 'SET_USERS', payload: response.data.data || response.data });
    } catch (error) {
      console.error('Fetch users failed:', error.message);
    }
  };

  const fetchProjects = async (filterParams = {}) => {
    try {
      let query = [];
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key]) query.push(`${key}=${filterParams[key]}`);
      });
      const endpoint = query.length > 0 ? `/projects?${query.join('&')}` : '/projects';
      const response = await api.get(endpoint);
      dispatch({ type: 'SET_PROJECTS', payload: response.data.data || response.data });
    } catch (error) {
      console.error('Fetch projects failed:', error.message);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      dispatch({ type: 'ADD_PROJECT', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Create project failed:', error.message);
      throw error;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await api.patch(`/projects/${id}`, projectData);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Update project failed:', error.message);
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    } catch (error) {
      console.error('Delete project failed:', error.message);
      throw error;
    }
  };

  const fetchIssues = async (filterParams = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let query = [];
      // Apply filters from parameters or use state filters
      const appliedFilters = { ...state.filters, ...filterParams };
      Object.keys(appliedFilters).forEach((key) => {
        if (appliedFilters[key]) query.push(`${key}=${appliedFilters[key]}`);
      });
      const endpoint = query.length > 0 ? `/issues?${query.join('&')}` : '/issues';
      const response = await api.get(endpoint);
      dispatch({ type: 'SET_ISSUES', payload: response.data.data || response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createIssue = async (issueData) => {
    try {
      const response = await api.post('/issues', issueData);
      dispatch({ type: 'ADD_ISSUE', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Create issue failed:', error.message);
      throw error;
    }
  };

  const updateIssue = async (id, issueData) => {
    try {
      const response = await api.patch(`/issues/${id}`, issueData);
      dispatch({ type: 'UPDATE_ISSUE', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Update issue failed:', error.message);
      throw error;
    }
  };

  const deleteIssue = async (id) => {
    try {
      await api.delete(`/issues/${id}`);
      dispatch({ type: 'DELETE_ISSUE', payload: id });
    } catch (error) {
      console.error('Delete issue failed:', error.message);
      throw error;
    }
  };

  const assignIssue = async (id, userId) => {
    try {
      const response = await api.patch(`/issues/${id}/assign`, { userId });
      dispatch({ type: 'UPDATE_ISSUE', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Assign issue failed:', error.message);
      throw error;
    }
  };

  const updateIssueStatus = async (id, status) => {
    try {
      const response = await api.patch(`/issues/${id}/status`, { status });
      dispatch({ type: 'UPDATE_ISSUE', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Update issue status failed:', error.message);
      throw error;
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get('/comments');
      dispatch({ type: 'SET_COMMENTS', payload: response.data.data || response.data });
    } catch (error) {
      console.error('Fetch comments failed:', error.message);
    }
  };

  const createComment = async (commentData) => {
    try {
      const response = await api.post('/comments', commentData);
      dispatch({ type: 'ADD_COMMENT', payload: response.data.data });
      return response.data;
    } catch (error) {
      console.error('Create comment failed:', error.message);
      throw error;
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      dispatch({ type: 'DELETE_COMMENT', payload: id });
    } catch (error) {
      console.error('Delete comment failed:', error.message);
      throw error;
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [issuesRes, projectsRes, developersRes] = await Promise.all([
        api.get('/analytics/issues'),
        api.get('/analytics/projects'),
        api.get('/analytics/developers')
      ]);
      dispatch({
        type: 'SET_ANALYTICS',
        payload: {
          issues: issuesRes.data.data,
          projects: projectsRes.data.data,
          developers: developersRes.data.data
        }
      });
    } catch (error) {
      console.error('Fetch analytics failed:', error.message);
    }
  };

  const setFilters = (filterData) => {
    dispatch({ type: 'SET_FILTERS', payload: filterData });
  };

  const syncData = async (syncParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/sync', syncParams);
      // After sync, re-fetch all datasets
      await Promise.all([
        fetchIssues(),
        fetchProjects(),
        fetchAnalytics()
      ]);
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logoutUser,
        fetchUsers,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        fetchIssues,
        createIssue,
        updateIssue,
        deleteIssue,
        assignIssue,
        updateIssueStatus,
        fetchComments,
        createComment,
        deleteComment,
        fetchAnalytics,
        setFilters,
        syncData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
