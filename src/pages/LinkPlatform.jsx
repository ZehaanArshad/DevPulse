import { Link } from 'react-router-dom'

function LinkPlatform() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Link a platform</h1>
        <Link to="/" className="text-indigo-400 hover:underline">
          Wapas Dashboard pe jao
        </Link>
      </div>
    </div>
  )
}

export default LinkPlatform
