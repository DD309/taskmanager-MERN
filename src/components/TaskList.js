import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

/**
 * @desc    A single task row component for the task list table.
 * @param   {object} task - The task object to display.
 * @param   {function} deleteTask - Function to call when the delete button is clicked.
 */
const Task = ({ task, deleteTask }) => (
  <tr className="hover:bg-gray-100">
    <td className="border px-4 py-2">{task.title}</td>
    <td className="border px-4 py-2">{task.description}</td>
    <td className="border px-4 py-2">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-blue-100 text-blue-800'}`}>
        {task.status}
      </span>
    </td>
    <td className="border px-4 py-2">
      <Link to={"/edit/" + task._id} className="text-blue-500 hover:text-blue-700 mr-4">Edit</Link>
      <button onClick={() => { deleteTask(task._id) }} className="text-red-500 hover:text-red-700">Delete</button>
    </td>
  </tr>
);

/**
 * @desc    The main dashboard component that displays the list of tasks.
 *          It handles fetching, displaying, and deleting tasks. It also implements
 *          polling to keep the data synchronized across multiple tabs.
 */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const token = localStorage.getItem('auth-token');

  const fetchTasks = useCallback(() => {
    if (!token) {
      history.push('/login');
      return;
    }

    axios.get('http://localhost:5000/tasks/', { headers: { 'x-auth-token': token } })
      .then(response => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('username');
          history.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [history, token]);

  useEffect(() => {
    // Clear tasks on user change to prevent showing old data
    setTasks([]);
    setLoading(true);

    fetchTasks();
    const intervalId = setInterval(fetchTasks, 5000);

    return () => clearInterval(intervalId);
  }, [fetchTasks, token]); // Add token as a dependency

  const deleteTask = (id) => {
    axios.delete('http://localhost:5000/tasks/' + id, { headers: { 'x-auth-token': token } })
      .then(res => {
        console.log(res.data);
        fetchTasks();
      })
      .catch(err => console.error(err));
  }

  if (loading) {
    return <div className="text-center mt-8">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Your Tasks</h3>
        <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Create New Task
        </Link>
      </div>
      {tasks.length > 0 ? (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(currenttask => (
                <Task task={currenttask} deleteTask={deleteTask} key={currenttask._id} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center bg-white shadow-md rounded p-8">
          <h4 className="text-xl font-bold mb-2">No tasks yet!</h4>
          <p className="text-gray-600">Click the "Create New Task" button to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;