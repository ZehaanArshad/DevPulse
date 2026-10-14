function DifficultyDonut({ difficulty }) {
  const { total, easy, medium, hard } = difficulty
  const easyPct = (easy / total) * 100
  const mediumPct = (medium / total) * 100

  const gradient = `conic-gradient(
    #22C55E 0% ${easyPct}%,
    #EAB308 ${easyPct}% ${easyPct + mediumPct}%,
    #EF4444 ${easyPct + mediumPct}% 100%
  )`
                // backdrop-blur-xl
  return (
    <div className="  bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5 hover:shadow-sm shadow-[#9CC0ED]">
      <h3 className="text-lg font-bold text-neutral-900">Problems Distribution</h3>
      <p className="text-sm text-neutral-400 mb-4">DSA — Based on Difficulty</p>

      <div className="flex items-center gap-6">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center "
          style={{ background: gradient }}
        >
          <div className="w-20 h-20 rounded-full bg-[#CDD8EB] flex items-center justify-center">
            <span className="text-2xl font-bold text-[#000000]">{total}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex justify-between items-center bg-[#22C55E] text-[#FFFFFF] rounded-lg px-4 py-2 text-sm font-medium">
            <span>Easy</span>
            <span>{easy}</span>
          </div>
          <div className="flex justify-between items-center bg-[#EAB308] text-[#FFFFFF] rounded-lg px-4 py-2 text-sm font-medium">
            <span>Medium</span>
            <span>{medium}</span>
          </div>
          <div className="flex justify-between items-center bg-[#EF4444] text-[#FFFFFF] rounded-lg px-4 py-2 text-sm font-medium">
            <span>Hard</span>
            <span>{hard}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DifficultyDonut
