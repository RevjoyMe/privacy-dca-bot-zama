interface StatsCardProps {
  title: string
  value: string
  description: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="text-center">
      <h4 className="text-3xl font-bold text-emerald-400 mb-2">{value}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
