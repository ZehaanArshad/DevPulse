function TopicBars({ topics }) {
  const max = Math.max(...topics.map((t) => t.count))

  return (
    <div className="backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-6 hover:shadow-sm shadow-[#9CC0ED]">
      <h3 className="text-lg font-bold text-neutral-900 mb-6">Problem Topic Wise Analysis</h3>

      <div className="flex flex-col gap-3">
        {topics.map((topic) => (
          <div key={topic.name} className="grid grid-cols-[140px_1fr] items-center gap-4">
            <span className="text-sm text-neutral-900 text-right">{topic.name}</span>
            <div className="relative h-9 bg-[#FCF2E9]/50 rounded-md overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r bg-[#2877D7] flex items-center justify-end pr-3"
                style={{ width: `${(topic.count / max) * 100}%` }}
              >
                <span className="text-sm font-semibold text-white">{topic.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopicBars
