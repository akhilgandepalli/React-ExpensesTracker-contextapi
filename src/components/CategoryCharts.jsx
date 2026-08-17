import React, { useEffect, useMemo, useState } from 'react'
import { dateBounds, formatCurrency, totalsByCategory } from '../utils'

const toXY = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

const arcPath = (cx, cy, r, start, end) => {
  const sweep = end - start
  if (sweep >= 359.999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
  }
  const [x1, y1] = toXY(cx, cy, r, start)
  const [x2, y2] = toXY(cx, cy, r, end)
  const large = sweep > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
}

const PieChart = ({ slices }) => {
  const size = 180
  const cx = 90
  const cy = 90
  const r = 78
  const total = slices.reduce((sum, item) => sum + item.value, 0)
  let angle = 0

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="pie-svg" role="img">
      {slices.map((slice) => {
        const sweep = total ? (slice.value / total) * 360 : 0
        const start = angle
        const end = angle + sweep
        angle = end
        return (
          <path key={slice.name} d={arcPath(cx, cy, r, start, end)} fill={slice.color}>
            <title>
              {slice.name}: {formatCurrency(slice.value)} ({slice.percent.toFixed(1)}%)
            </title>
          </path>
        )
      })}
      <circle cx={cx} cy={cy} r={44} className="pie-hole" />
    </svg>
  )
}

const BarChart = ({ slices }) => {
  const max = Math.max(...slices.map((item) => item.value), 1)
  return (
    <ul className="bar-chart">
      {slices.map((slice) => (
        <li key={slice.name}>
          <div className="bar-label">
            <span>{slice.name}</span>
            <span>{formatCurrency(slice.value)}</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${(slice.value / max) * 100}%`,
                background: slice.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

const Legend = ({ slices }) => (
  <ul className="chart-legend">
    {slices.map((slice) => (
      <li key={slice.name}>
        <span className="legend-dot" style={{ background: slice.color }} />
        <span className="legend-name">{slice.name}</span>
        <span className="legend-value">
          {formatCurrency(slice.value)} · {slice.percent.toFixed(1)}%
        </span>
      </li>
    ))}
  </ul>
)

const ChartBlock = ({ title, tone, slices, chartType }) => (
  <article className={`chart-block ${tone}`}>
    <h4>{title}</h4>
    {slices.length === 0 ? (
      <div className="empty-state compact">
        <p>No {title.toLowerCase()} in this range</p>
        <span>Add transactions or widen the dates.</span>
      </div>
    ) : chartType === 'pie' ? (
      <>
        <PieChart slices={slices} />
        <Legend slices={slices} />
      </>
    ) : (
      <BarChart slices={slices} />
    )}
  </article>
)

const CategoryCharts = ({ open, transactions, onClose }) => {
  const bounds = useMemo(() => dateBounds(transactions), [transactions])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [chartType, setChartType] = useState('pie')

  useEffect(() => {
    if (!open) return
    setFrom(bounds.from)
    setTo(bounds.to)
  }, [open, bounds.from, bounds.to])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const rangeError = from && to && from > to
  const incomeSlices = useMemo(
    () => (rangeError ? [] : totalsByCategory(transactions, 'income', from, to)),
    [transactions, from, to, rangeError]
  )
  const expenseSlices = useMemo(
    () => (rangeError ? [] : totalsByCategory(transactions, 'expense', from, to)),
    [transactions, from, to, rangeError]
  )

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal charts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="charts-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="charts-head">
          <div>
            <p className="eyebrow">Category breakdown</p>
            <h3 id="charts-title">Income & expense charts</h3>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="chart-filters">
          <label>
            From
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              setFrom(bounds.from)
              setTo(bounds.to)
            }}
          >
            Reset dates
          </button>
        </div>

        {rangeError ? (
          <p className="form-error">From date must be on or before the To date.</p>
        ) : null}

        <div className="filter-pills chart-type-pills" role="tablist" aria-label="Chart type">
          <button
            type="button"
            className={chartType === 'pie' ? 'pill active' : 'pill'}
            onClick={() => setChartType('pie')}
          >
            Pie chart
          </button>
          <button
            type="button"
            className={chartType === 'bar' ? 'pill active' : 'pill'}
            onClick={() => setChartType('bar')}
          >
            Bar graph
          </button>
        </div>

        <div className="charts-grid">
          <ChartBlock title="Income" tone="income" slices={incomeSlices} chartType={chartType} />
          <ChartBlock title="Expense" tone="expense" slices={expenseSlices} chartType={chartType} />
        </div>
      </div>
    </div>
  )
}

export default CategoryCharts
