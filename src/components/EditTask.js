import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

/**
 * @desc    Component with a form for editing an existing task.
 *          It fetches the current task data to pre-fill the form and
 *          ensures the user is logged in before rendering.
 */
const EditTask = () => {
  //state for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const history = useHistory();
  //get the task ID from the URL parameters
  const { id } = useParams();

  //effect hook to fetch the task data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    //route protection: if no token, redirect to login
    if (!token) {
      history.push('/login');
      return;
    }

    //fetch the specific task by its ID
    axios.get(`http://localhost:5000/tasks/${id}`, { headers: { 'x-auth-token': token } })
      .then(response => {
        //pre-fill the form with the fetched task data
        setTitle(response.data.title);
        setDescription(response.data.description);
        setStatus(response.data.status);
      })
      .catch(function (error) {
        console.log(error);
        //if an error occurs (e.g., task not found or not authorized),
        //redirect the user to the home page.
        history.push('/');
      });
  }, [id, history]);

  /**
   * @desc    Handles the form submission to update the task.
   */
  const onSubmit = (e) => {
    e.preventDefault();

    const task = {
      title: title,
      description: description,
      status: status,
    };

    //send a pOST request to the update endpoint with the new data
    axios.post(`http://localhost:5000/tasks/update/${id}`, task, { headers: { 'x-auth-token': localStorage.getItem('auth-token') } })
      .then(res => {
        console.log(res.data);
        //on success, redirect the user back to the main task list
        history.push('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mx-auto mt-8 max-w-lg">
      <h3 className="text-2xl font-bold mb-4">Edit Task</h3>
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
          <input type="submit" value="Save Changes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </div>
      </form>
    </div>
  );
};

export default EditTask;