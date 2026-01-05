import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

/**
 * @desc    Login component for user authentication.
 *          Provides a form for users to log in. On success, it stores the auth
 *          token and username in localStorage and redirects to the home page.
 *          It also prevents already logged-in users from viewing the page.
 */
const Login = () => {
  //state for form inputs and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  //effect hook to protect the route
  useEffect(() => {
    //if a token exists, the user is already logged in. Redirect them to the home page.
    const token = localStorage.getItem('auth-token');
    if (token) {
      history.push('/');
    }
  }, [history]);

  /**
   * @desc    Handles the form submission for logging in.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); //clear previous errors

    try {
      const user = {
        username: username,
        password: password,
      };

      //send login request to the backend API
      const loginRes = await axios.post('http://localhost:5000/users/login', user);
      
      //on success, store the token and username in the browser's local storage
      localStorage.setItem('auth-token', loginRes.data.token);
      localStorage.setItem('username', loginRes.data.user.username);
      
      //redirect to the home page and force a reload to ensure all components
      //(like the navbar) update with the new authentication state.
      history.push('/');
      window.location.reload();

    } catch (err) {
      //handle errors from the server (e.g., invalid credentials)
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <h3 className="text-2xl font-bold mb-4 text-center">Login</h3>
      {/*display error message if it exists */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input type="text"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <input type="submit" value="Login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
        </div>
      </form>
    </div>
  );
};

export default Login;