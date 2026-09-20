import { Link } from 'react-router-dom'

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Signup page</h1>
        <Link to="/login" className="text-indigo-400 hover:underline">
          Pehle se account hai? Login karo
        </Link>
      </div>
    </div>
  )
}

export default Signup
