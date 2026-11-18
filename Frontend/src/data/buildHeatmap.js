const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// submissions ki ginti -> 0 se 4 tak ka rang (heatmap ke 5 shades)
function toIntensity(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

export function buildHeatmap(calendar = {}) {
  const cells = []
  const today = new Date()
  const start = new Date(today)
  start.setFullYear(today.getFullYear() - 1)

  // ek saal peeche se aaj tak, har din ka cell
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const date = formatDate(d)
    const count = calendar[date] ?? 0
    cells.push({ date, count, intensity: toIntensity(count) })
  }

  const submissions = cells.reduce((sum, c) => sum + c.count, 0)

  // sabse lambi lagatar chalne wali streak
  let maxStreak = 0
  let run = 0
  for (const c of cells) {
    run = c.count > 0 ? run + 1 : 0
    maxStreak = Math.max(maxStreak, run)
  }

  // abhi chal rahi streak (aaj abhi kuch nahi kiya to kal se ginti shuru)
  let currentStreak = 0
  let i = cells.length - 1
  if (cells[i].count === 0) i--
  while (i >= 0 && cells[i].count > 0) {
    currentStreak++
    i--
  }

  return { submissions, maxStreak, currentStreak, months: MONTHS, cells }
}
