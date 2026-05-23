/**
 * HeatmapGrid — renders a GitHub-style heatmap for Neural Garden.
 * data: Array<{ date: string, count: number, total: number }>
 * Shows last 56 days (8 weeks × 7 days)
 */
export default function HeatmapGrid({ data = [] }) {
  const getColor = (count, total) => {
    if (!count) return '#fce8d8'
    const ratio = Math.min(count / total, 1)
    if (ratio < 0.25) return '#e8b89a'
    if (ratio < 0.5)  return '#c88860'
    if (ratio < 0.75) return '#a06030'
    return '#7a3c10'
  }

  // Build 7-row × 8-col grid (oldest left)
  const weeks = []
  for (let w = 0; w < 8; w++) {
    weeks.push(data.slice(w * 7, w * 7 + 7))
  }

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div
              key={di}
              className="w-[14px] h-[14px] rounded-sm flex-shrink-0"
              style={{ backgroundColor: getColor(day.count, day.total) }}
              title={`${day.date}: ${day.count}/${day.total} habits`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
