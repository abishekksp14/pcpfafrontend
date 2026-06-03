import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';

const TaskList = ({ tasks, refreshStats }) => {
  const { deleteTask, updateTask } = useTaskContext();
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      refreshStats();
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await updateTask(task._id, { status: newStatus });
    refreshStats();
  };

  if (!tasks || tasks.length === 0) {
    return <p className="no-tasks">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className={`task-card ${task.status}`}>
          {editingId === task._id ? (
            <TaskForm 
              task={task} 
              onSuccess={() => { setEditingId(null); refreshStats(); }} 
              onCancel={() => setEditingId(null)} 
            />
          ) : (
            <>
              <div className="task-header">
                <h4>{task.title}</h4>
                <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
              </div>
              <p>{task.description}</p>
              <div className="task-actions">
                <button onClick={() => handleStatusToggle(task)}>
                  Mark {task.status === 'pending' ? 'Completed' : 'Pending'}
                </button>
                <button onClick={() => setEditingId(task._id)}>Edit</button>
                <button className="danger-btn" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
