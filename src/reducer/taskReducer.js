export const initialState = {
  authUser: null,
  token: null,
  users: [],
  projects: [],
  issues: [],
  comments: [],
  filters: {
    search: '',
    status: '',
    priority: '',
    severity: ''
  },
  analytics: {
    issues: null,
    projects: [],
    developers: []
  },
  loading: false,
  error: null,
};

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        authUser: action.payload.user,
        error: null
      };
    case 'LOGOUT':
      return {
        ...initialState,
        token: null,
        authUser: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload
      };
    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload
      };
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload
        }
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => p._id === action.payload._id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload)
      };
    case 'ADD_ISSUE':
      return {
        ...state,
        issues: [action.payload, ...state.issues]
      };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((i) => i._id === action.payload._id ? action.payload : i)
      };
    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter((i) => i._id !== action.payload)
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter((c) => c._id !== action.payload)
      };
    default:
      return state;
  }
};
