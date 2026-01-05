import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

/**
 * @desc    Component with a form for creating a new task.
 *          It ensures the user is logged in before rendering.
 */
const CreateTask = () => {
  //state for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('New'); // Default status
  const history = useHistory();

  //effect hook for route protection
  useEffect(() => {
    //if no token is found, the user is not logged in. Redirect to the login page.
    const token = localStorage.getItem('auth-token');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  /**
   * @desc    Handles the form submission to create a new task.
   */
  const onSubmit = (e) => {
    e.preventDefault();

    const task = {
      title: title,
      description: description,
      status: status,
    };

    //send a POST request to the backend with the new task data and auth token
    axios.post('http://localhost:5000/tasks/add', task, { headers: { 'x-auth-token': localStorage.getItem('auth-token') } })
      .then(res => {
        console.log(res.data);
        //on success, redirect the user back to the main task list
        history.push('/');
      })
      .catch(err => {
        console.error(err);
        //if the token is invalid, redirect to login
        if (err.response && err.response.status === 401) {
          history.push('/login');
        }
      });
  };

  return (
    <div className="container mx-auto mt-8 max-w-lg">
      <h3 className="text-2xl font-bold mb-4">Create New Task</h3>
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title: </label>
          <input type="text"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description: </label>
          <input type="text"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status: </label>
          <select
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <option>New</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <input type="submit" value="Create Task" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </div>
      </form>
    </div>
  );
};

export default CreateTask;