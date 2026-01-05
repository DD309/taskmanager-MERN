import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

/**
 * @desc    The main navigation bar component for the application.
 *          It conditionally renders different links based on the user's
 *          authentication status and handles cross-tab synchronization.
 */
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const history = useHistory();

  // Function to update state from localStorage
  const updateAuthState = () => {
    const token = localStorage.getItem('auth-token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  // Effect hook to set initial state and listen for cross-tab storage changes
  useEffect(() => {
    // Set the initial state when the component mounts
    updateAuthState();

    // Define the event handler for storage changes
    const handleStorageChange = (event) => {
      // Check if the change happened to our auth token in another tab
      if (event.key === 'auth-token') {
        console.log('Auth token changed in another tab. Reloading...');
        // Force a reload to synchronize state with the new user
        window.location.reload();
      }
    };

    // Add the event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * @desc    Handles the user logout process.
   */
  const logout = () => {
    // Clear all user-related data from local storage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    
    // Update state and redirect to the login page
    updateAuthState();
    history.push('/login');
    
    // Force a reload to ensure a clean state across the application
    window.location.reload();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">Task Manager</Link>
        <div>
          {/* Conditionally render UI based on authentication status */}
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="text-white mr-4">Welcome, {username}</span>
              <button onClick={logout} className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;