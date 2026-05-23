/**
 * HeatmapGrid — renders a GitHub-style heatmap for Neural Garden.
 * data: Array<{ date: string, count: number, total: number }>
 * Shows last 56 days (8 weeks × 7 days)
 */
export default function HeatmapGrid({ data = [] }) {
  const HEATMAP_STEP = 3

  const formatDate = (isoDate) => {
    if (!isoDate) return 'Sin fecha'
    const parsed = new Date(`${isoDate}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return isoDate
    return parsed.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getColor = (count) => {
    const level = Math.floor(Math.max(0, Number(count) || 0) / HEATMAP_STEP)
    if (level <= 0) return 'var(--color-heatmap-0)'
    if (level === 1) return 'var(--color-heatmap-1)'
    if (level === 2) return 'var(--color-heatmap-2)'
    if (level === 3) return 'var(--color-heatmap-3)'
    return 'var(--color-heatmap-4)'
  }

  // Build 7-row columns from available data only (oldest left).
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div key={di} className="relative group">
              {(() => {
                const completedText = `${day.count} hábito${day.count === 1 ? '' : 's'} cumplido${day.count === 1 ? '' : 's'}`
                const tooltipText = `${formatDate(day.date)}: ${completedText}`
                return (
              <div
                className="w-[14px] h-[14px] rounded-sm flex-shrink-0"
                style={{ backgroundColor: getColor(day.count) }}
                title={tooltipText}
                aria-label={tooltipText}
              />
                )
              })()}
              <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[115%] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-20 whitespace-nowrap rounded-md bg-on-surface text-surface text-[10px] px-2 py-1 shadow-md">
                {formatDate(day.date)}: {day.count} hábito{day.count === 1 ? '' : 's'} cumplido{day.count === 1 ? '' : 's'}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
