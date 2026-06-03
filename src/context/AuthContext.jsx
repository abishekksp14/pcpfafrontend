import { createContext, useContext } from 'react';
import { AppContext, AppProvider } from './AppContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  return (
    <AppProvider>
      <AuthConsumerWrapper>{children}</AuthConsumerWrapper>
    </AppProvider>
  );
};

const AuthConsumerWrapper = ({ children }) => {
  const { authUser, token, loginUser, logoutUser } = useContext(AppContext);
  const isAuthenticated = !!token;
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, authUser, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
