import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error('Failed to delete blog:', err);
        alert(err.response?.data?.message || 'Failed to delete blog. Check console for details.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Blogs</h1>
        <Link 
          to="/create" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blogs found. Create your first blog!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog._id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
              {blog.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:5000/${blog.image}`} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link 
                      to={`/view/${blog._id}`} 
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    {user && user.id === blog.author?._id && (
                      <>
                        <Link 
                          to={`/edit/${blog._id}`} 
                          className="text-green-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button 
  onClick={() => handleDelete(blog._id)}
  className="text-red-600 hover:underline"
  disabled={loading}
>
  {loading ? 'Deleting...' : 'Delete'}
</button>
                      </>
                    )}
                  </div>
                  {blog.author?.profileImage && (
                    <img 
                      src={`http://localhost:5000/${blog.author.profileImage}`} 
                      alt={blog.author.email} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;