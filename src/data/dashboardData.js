function formatDate(d) {
  // Local date ko 'YYYY-MM-DD' string banata hai (toISOString avoid kiya, UTC ki wajah se)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}


function generateHeatmapCells(weeks = 52) {
  const cells = []
  const today = new Date()

  // weeks * 7 din peeche jao, phir us hafte ke Sunday tak aur peeche (getDay() = 0 for Sunday)
  const start = new Date(today)
  start.setFullYear(today.getFullYear() -  1)
  // start.setDate(today.getDate() - (weeks * 7 - 1))
  // start.setDate(start.getDate() - start.getDay())

  // start se aaj tak, ek-ek din aage badho
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const rand = Math.random()
    let intensity = 0
    if (rand > 0.85) intensity = 4
    else if (rand > 0.65) intensity = 3
    else if (rand > 0.45) intensity = 2
    else if (rand > 0.25) intensity = 1
    cells.push({ date: formatDate(d), intensity })
  }
  return cells
}

// Output ka example
// cells = [
//   { date: '2025-10-12', intensity: 0 },
//   { date: '2025-10-13', intensity: 2 },
//   { date: '2025-10-14', intensity: 4 },
//   ...
// ]


export const dashboardData = {
  stats: {
    questionsSolved: 191,
    activeDays: 79,
  },
  heatmap: {
    submissions: 395,
    maxStreak: 13,
    currentStreak: 1,
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    cells: generateHeatmapCells(52),
  },
  difficulty: {
    total: 183,
    easy: 90,
    medium: 71,
    hard: 22,
  },
  topics: [
    { name: 'Arrays', count: 97 },
    { name: 'Math', count: 65 },
    { name: 'HashMap and Set', count: 37 },
    { name: 'Sorting', count: 34 },
    { name: 'Two Pointers', count: 24 },
    { name: 'Binary Search', count: 22 },
    { name: 'String', count: 19 },
    { name: 'Greedy Algorithms', count: 15 },
    { name: 'Dynamic Programming', count: 10 },
    { name: 'Enumeration', count: 10 },
  ],
  problemPlatforms: [
    { key: 'leetcode', label: 'LeetCode', initials: 'https://assets.leetcode.com/static_assets/public/images/LeetCode_logo_rvs.png', color: 'bg-orange-500/0', connected: false, url: 'https://leetcode.com', to: '/platform/leetcode' },
    { key: 'codeforces', label: 'CodeForces', initials: 'https://cdn.iconscout.com/icon/free/png-256/code-forces-3521352-2944796.png', color: 'bg-neutral-700/0', connected: false, url: 'https://codeforces.com', to: '/platform/codeforces' },
    { key: 'atcoder', label: 'AtCoder', initials: 'https://img.atcoder.jp/logo/atcoder/logo_transparent.png', color: 'bg-neutral-900/0', connected: true, url: 'https://atcoder.jp', to: '/platform/atcoder' },
    { key: 'gfg', label: 'GeeksForGeeks', initials: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg', color: 'bg-green-600/0', connected: false, url: 'https://www.geeksforgeeks.org', to: '/platform/gfg' },
  ],
  devPlatforms: [
    { key: 'github', label: 'GitHub', initials: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', color: 'bg-neutral-900/0', connected: true, url: 'https://github.com', to: '/platform/github' },
    { key: 'categories', label: 'Categories Repo', initials: 'https://www.svgrepo.com/show/448449/git-repo.svg', color: 'bg-indigo-500/0', connected: false, url: 'https://github.com', to: '/platform/categories' },
  ],
  connectLinks: [
    { key: 'email', label: 'zehaanasgar@gmail.com', initials: 'https://images.icon-icons.com/2642/PNG/512/google_mail_gmail_logo_icon_159346.png', color: 'bg-orange-400/0', connected: false, url: 'mailto:zehaanasgar@gmail.com' },
    { key: 'linkedin', label: 'LinkedIn', initials: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/926/small/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png', color: 'bg-blue-600/0', connected: false, url: 'https://www.linkedin.com' },
  ],

}




// export const dashboardData  Isme 3 cheezein hain:
// const: variable banao jisko dobara assign nahi kar sakte.
// dashboardData: variable ka naam. Value ek object hai.
// export: is variable ko doosri file mein use karne ke liye available kar do.
// Bina export ke ye variable sirf isi file mein dikhega

// export default dashboardData.stats
// Default wala bina curly braces ke
// Named wale curly braces ke andar



// Array par .map() chalta hai, jisse UI ek baar likhke sabke liye automatically ban jaati hai:


// connected: false
// Abhi ye hardcoded (haath se likha hua) hai. Real app mein:
// User "Connect" button dabata hai
// Wo apna username daalta hai ya login karta hai
// Backend verify karta hai
// connected true ho jaata hai (database mein save hota hai)