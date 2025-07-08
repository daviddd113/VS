import React from 'react'

function MetricBox({ label, value, color = "text-gray-900" }) {
  return (
    <div
      className="p-4 rounded-[20px] shadow"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <div className="text-sm font-medium text-gray-600 mb-1">
        {label}
      </div>
      <div className={`text-lg font-bold ${color}`}>
        {value}
      </div>
    </div>
  )
}

export default MetricBox
