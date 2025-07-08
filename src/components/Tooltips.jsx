import React from 'react'
import { getDateFromMonth, dollarFormatter } from '../utils/helpers'

export function PriceTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const totalMonths = payload[0].payload?.totalMonths ?? 0
    const date = getDateFromMonth(label, totalMonths)
    const currentPrice = payload[0].value
    const startPrice = payload[0].payload?.startPrice ?? currentPrice
    const totalReturn = ((currentPrice - startPrice) / startPrice * 100).toFixed(2)
    const returnColor = totalReturn >= 0 ? "#16a34a" : "#dc2626"
    
    return (
      <div className="bg-white p-2 rounded shadow text-xs border border-gray-200">
        <div><b>{date}</b></div>
        <div>Kurs: <b>{dollarFormatter(currentPrice)}</b></div>
        <div>Rendite: <b style={{ color: returnColor }}>{totalReturn}%</b></div>
      </div>
    )
  }
  return null
}

export function InvestmentTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const month = payload[0].payload?.month ?? 0
    const totalMonths = payload[0].payload?.totalMonths ?? 0
    const yearsPassed = Math.floor(month / 12)
    const monthsPassed = month
    
    // Berechne das investierte Kapital unter Berücksichtigung der erweiterten Einstellungen
    let totalInvested = Number(window._startAmount) || 0;
    let currentAmount = Number(window._amount) || 0;
    
    if (window._isMonthly) {
      for (let i = 0; i < monthsPassed; i++) {
        const currentYear = Math.floor(i / 12);
        const currentMonth = (i % 12) + 1;
        
        // Prüfe Sparratenerhöhung
        if (window._increaseEveryNYears && window._increaseAmount && currentYear > 0 && currentYear % window._increaseEveryNYears === 0 && i % 12 === 0) {
          currentAmount += Number(window._increaseAmount);
        }
        
        let monthlyContribution = currentAmount;
        // Prüfe doppelte Einzahlung
        if (window._doubleMonths?.includes(currentMonth)) {
          monthlyContribution *= 2;
        }
        totalInvested += monthlyContribution;
      }
    } else {
      for (let year = 0; year < yearsPassed; year++) {
        if (window._increaseEveryNYears && window._increaseAmount && year > 0 && year % window._increaseEveryNYears === 0) {
          currentAmount += Number(window._increaseAmount);
        }
        totalInvested += currentAmount;
      }
    }
    
    const date = getDateFromMonth(label, totalMonths)
    return (
      <div className="bg-white p-2 rounded shadow text-xs border border-gray-200">
        <div><b>{date}</b></div>
        <div>Depotwert: <b>{dollarFormatter(payload[0].value)}</b></div>
        <div>Investiert: <b>{dollarFormatter(totalInvested)}</b></div>
      </div>
    )
  }
  return null
}
