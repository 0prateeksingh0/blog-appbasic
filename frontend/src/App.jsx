import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ViewBlog from './pages/ViewBlog';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register login={login} />} />
          <Route path="/" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute user={user}><CreateBlog /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute user={user}><EditBlog /></PrivateRoute>} />
          <Route path="/view/:id" element={<ViewBlog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;