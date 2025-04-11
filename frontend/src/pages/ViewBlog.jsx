import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError('Failed to fetch blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

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

  if (!blog) {
    return <div className="text-center mt-8">Blog not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {blog.image && (
          <div className="h-64 md:h-96 overflow-hidden">
            <img 
              src={`http://localhost:5000/${blog.image}`} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex items-center mb-6">
            {blog.author?.profileImage && (
              <img 
                src={`http://localhost:5000/${blog.author.profileImage}`} 
                alt={blog.author.email} 
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <p className="text-sm text-gray-600">Posted by {blog.author?.email}</p>
              <p className="text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{blog.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;