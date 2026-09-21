import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Login page</h1>
        <Link to="/signup" className="text-indigo-400 hover:underline">
          Account nahi hai? Signup karo
        </Link>
      </div>
    </div>
  )
}

export default Login
