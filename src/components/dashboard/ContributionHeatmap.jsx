const intensityColor = {
  0: 'bg-green-100/20',
  1: 'bg-green-200',
  2: 'bg-green-400',
  3: 'bg-green-800',
  4: 'bg-green-900',
}

function ContributionHeatmap({ heatmap }) {
  const weeks = []
  for (let i = 0; i < heatmap.cells.length; i += 7) {
    weeks.push(heatmap.cells.slice(i, i + 7))
  }

  return (
    <div className="min-w-0 backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6 text-sm text-neutral-900">
          <span>
            Submissions <b className="text-[#2061B1]">{heatmap.submissions}</b>
          </span>
          <span>
            Max Streak <b className="text-[#2061B1]">{heatmap.maxStreak}</b>
          </span>
          <span>
            Current Streak <b className="text-[#2061B1]">{heatmap.currentStreak}</b>
          </span>
        </div>
        <button className="bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-lg px-3 py-1.5 text-sm text-neutral-900">
          Current ▾
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
  <div className="w-max">

    <div className="flex gap-0.5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5">
            {week.map((intensity, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-[15px] h-[15px] rounded-sm ${intensityColor[intensity]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-neutral-500 mt-2">
        {heatmap.months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>

  </div>
</div>
    </div>
  )
}

export default ContributionHeatmap