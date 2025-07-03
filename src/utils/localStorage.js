// Username
export const getUsername = () => localStorage.getItem('username');
export const setUsername = (username) => localStorage.setItem('username', username);
export const removeUsername = () => localStorage.removeItem('username');

// Tasks
export const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};
export const setTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks)); 