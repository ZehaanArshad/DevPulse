import { Link, useParams } from 'react-router-dom'

const titles = {
  'problem-solving': 'Problem Solving Stats',
  development: 'Development Stats',
  connect: 'Connect with me',
}

function Section() {
  const { name } = useParams()

  return (
    <div className="min-h-screen bg-[#FCF2E9] text-neutral-900 p-8">
      <Link to="/" className="text-[#2061B1] hover:underline">
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4">{titles[name] ?? 'Not found'}</h1>
      <p className="mt-2">Is section ka content yahan aayega.</p>
    </div>
  )
}

export default Section
