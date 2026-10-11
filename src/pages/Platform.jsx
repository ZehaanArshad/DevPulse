import { Link, useParams } from 'react-router-dom'

function Platform() {
  const { name } = useParams()

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900 p-8">
      <Link to="/" className="text-[#2061B1] hover:underline">
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 capitalize">{name}</h1>
      <p className="mt-2">Is platform ke stats yahan aayenge.</p>
    </div>
  )
}

export default Platform
