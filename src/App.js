import React from 'react';
import 'tailwindcss/tailwind.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import EditTask from './components/EditTask';
import CreateTask from './components/CreateTask';
import Login from './components/Login';
import Register from './components/Register';

/**
 * @desc    main application component.
 *          It sets up the React Router to handle client-side navigation
 *          and maps URL paths to their corresponding components.
 */
function App() {
  return (
    <Router>
      {/*navbar component is displayed on all pages */}
      <Navbar />
      <div className="container mx-auto p-4">
        {/*defines the routes*/}
        <Route path="/" exact component={TaskList} />
        <Route path="/edit/:id" component={EditTask} />
        <Route path="/create" component={CreateTask} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;