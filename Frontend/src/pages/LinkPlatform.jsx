import { useParams } from 'react-router-dom'

function LinkPlatform() {
  const { name } = useParams()
  return (
    <div className="px-8 py-4">
      <h1 className="text-3xl font-bold capitalize">{name}</h1>
      <p className="mt-2">Is platform ke stats yahan aayenge.</p>
    </div>
  )
}

export default LinkPlatform
