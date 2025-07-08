import React from 'react'
import MetricBox from './MetricBox'
import { calculateMetrics } from '../utils/calculations'

function MetricsPanel({
  portfolioMode,
  asset,
  result,
  years,
  startAmount,
  savingAmount,
  savingType,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths
}) {
  if (!result) return null

  // Error Handling für Metriken-Berechnung
  let metrics = {}
  try {
    metrics = calculateMetrics({
      startAmount,
      amount: savingAmount,
      years,
      result,
      isMonthly: savingType === 'monthly',
      increaseEveryNYears: Number(increaseEveryNYears) || 0,
      increaseAmount: Number(increaseAmount) || 0,
      doubleMonths
    });
  } catch (error) {
    console.error('Fehler bei der Metriken-Berechnung:', error)
    return (
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-red-100 border border-red-300">
          <div className="text-red-600 text-sm">
            Fehler bei der Berechnung der Metriken
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <MetricBox
        label="Asset"
        value={portfolioMode ? "Portfolio" : `${asset?.name || 'Unbekannt'}`}
      />

      <MetricBox
        label="Investiertes Kapital"
        value={metrics.invested?.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }) || "0 €"}
      />

      <MetricBox
        label={`Endkapital nach ${years} Jahren`}
        value={result.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        })}
        color="text-green-600"
      />

      <MetricBox
        label="Endkapital abzgl. KESt"
        value={metrics.resultAfterTax?.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }) || "0 €"}
        color="text-green-600"
      />

      <MetricBox
        label="Gewinn/Verlust"
        value={`${metrics.profit?.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }) || "0 €"} (${metrics.profitPercentage || "0"}%)`}
        color={(metrics.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}
      />

      <MetricBox
        label="Ø Jährliche Rendite"
        value={`${metrics.avgYearlyReturn || "0"}%`}
        color={(metrics.avgYearlyReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}
      />
    </div>
  )
}

export default MetricsPanel
