import { createContext, useContext } from 'react';
import { AppContext } from './AppContext';

export const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const {
    issues,
    loading,
    error,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    syncData,
    setFilters
  } = useContext(AppContext);

  const fetchTasks = async (query = '') => {
    await fetchIssues({ search: query });
  };

  const fetchTasksByFilter = async (status, priority) => {
    await fetchIssues({ status, priority });
  };

  const addTask = async (taskData) => {
    return await createIssue(taskData);
  };

  const updateTask = async (id, taskData) => {
    return await updateIssue(id, taskData);
  };

  const deleteTask = async (id) => {
    return await deleteIssue(id);
  };

  const syncTasks = async (token) => {
    return await syncData({ token });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: issues,
        loading,
        error,
        fetchTasks,
        fetchTasksByFilter,
        addTask,
        updateTask,
        deleteTask,
        syncTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
