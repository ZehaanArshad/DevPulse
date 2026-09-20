import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/link-platform" className="text-indigo-400 hover:underline">
          Platform link karo
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
