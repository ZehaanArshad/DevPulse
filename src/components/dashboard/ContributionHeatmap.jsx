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
  // weeks ek 2D array ban jata hai: [[7 din], [7 din], ...].
    // Har week ke pehle din ka month number (1-12), date string se
  const monthOfWeek = weeks.map((week) => Number(week[0].date.slice(5, 7)))
// weeks[0]  -> week[0].date -> '2026-03-15' -> 03

  return (
    <div className="min-w-0 backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5 hover:shadow-sm shadow-[#9CC0ED]">
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

      <div className="flex gap-0.5 overflow-x-auto overflow-y-hidden [scrollbar-color:#9CC0ED_transparent] p-7 -m-7">
        {/* Code kis order me chalta hai? (1 week div, uske 7 cells, phir agla) */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5 ">   {/* ← 52 div banta hai (har week ke liye 1) */}
            
            {week.map((cell) => (
              <div
              key={cell.date}
              className={`group relative w-[14px] h-[14px] rounded-sm ${intensityColor[cell.intensity]}`}
              >
              
                <span
                className="hidden group-hover:block absolute bottom-full -translate-x-1/3 z-10 whitespace-nowrap pointer-events-none rounded bg-[#9CC0ED]/50 px-1 py-1 text-xs text-black font-mono shadow-md shadow-[#9CC0ED] border border-[#9CC0ED] backdrop-blur-sm">
                  {cell.date}
                  </span>
                  </div>

              ))}
              {/* weeks>week>cell(1 din) */}

              <div className="relative h-4 mt-1">
              <span className="absolute left-0 text-xs text-neutral-900 whitespace-nowrap">
                {weekIndex === 0 || monthOfWeek[weekIndex] !== monthOfWeek[weekIndex - 1]
                  ? heatmap.months[monthOfWeek[weekIndex] - 1].slice(0, 3)
                  : ''}
              </span>
            </div>


          </div>
        ))}
        
      </div>


    </div>
  )
}

export default ContributionHeatmap
