function StatCard({ label, value }) {
  return (
    <div className="backdrop-blur-xl bg-[#9CC0ED]/50 border border-[#9CC0ED] rounded-2xl p-5 hover:shadow-sm shadow-[#9CC0ED]">
      <p className="text-sm text-neutral-900">{label}</p>
      <p className="text-4xl font-bold text-[#2061B1] mt-2">{value}</p>
    </div>
  )
}

export default StatCard