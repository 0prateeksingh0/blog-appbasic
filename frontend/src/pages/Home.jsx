import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Blog App</h1>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition">
            Sign In
          </Link>
          <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
