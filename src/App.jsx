import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppRouter />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
