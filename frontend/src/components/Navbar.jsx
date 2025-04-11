import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">BlogApp</Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Hello, {user.email}</span>
              {user.profileImage && (
                <img 
                  src={`http://localhost:5000/${user.profileImage}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <button 
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 text-blue-600 hover:underline">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;