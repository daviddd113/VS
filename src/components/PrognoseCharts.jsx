import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { calculatePrognoseData, calculatePrognoseMetrics } from '../utils/prognoseCalculations'

function PrognoseTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <div className="font-semibold text-gray-800">Jahr {label}</div>
        <div className="text-green-600">
          <b>Depotwert: {data.value.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}</b>
        </div>
        <div className="text-gray-600 text-sm">
          Investiert: {data.invested.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}
        </div>
        <div className="text-blue-600 text-sm">
          Gewinn: {(data.value - data.invested).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
    )
  }
  return null
}

function PrognoseCharts({
  startAmount,
  savingType,
  savingAmount,
  years,
  rendite,
  dividendenRendite,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths
}) {
  // Debug-Ausgabe der Eingabeparameter
  console.log('PrognoseCharts Props:', {
    startAmount,
    savingType,
    savingAmount,
    years,
    rendite,
    dividendenRendite,
    increaseEveryNYears,
    increaseAmount,
    doubleMonths
  })

  // Verbesserte Validierung der Eingaben
  if (!savingAmount || !years || rendite === "" || rendite === null || rendite === undefined || !savingType) {
    console.log('Validation failed:', { savingAmount, years, rendite, savingType })
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Keine Daten verfügbar</div>
          <div>Bitte füllen Sie alle Felder aus, um eine Prognose zu sehen.</div>
        </div>
      </div>
    )
  }

  // Stelle sicher, dass rendite als Zahl behandelt wird
  const renditeNumber = Number(rendite)
  if (isNaN(renditeNumber)) {
    console.log('Rendite is not a number:', rendite)
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Ungültige Eingabe</div>
          <div>Bitte überprüfen Sie Ihre Rendite-Eingabe.</div>
        </div>
      </div>
    )
  }

  // Error Handling für Berechnungen
  let prognoseData = []
  let metrics = {}
  
  try {
    prognoseData = calculatePrognoseData({
      startAmount: Number(startAmount) || 0,
      savingAmount: Number(savingAmount),
      years: Number(years),
      rendite: renditeNumber / 100,
      dividendenRendite: Number(dividendenRendite) / 100 || 0,
      isMonthly: savingType === 'monthly',
      increaseEveryNYears: Number(increaseEveryNYears) || 0,
      increaseAmount: Number(increaseAmount) || 0,
      doubleMonths: doubleMonths || []
    })

    metrics = calculatePrognoseMetrics({
      startAmount: Number(startAmount) || 0,
      savingAmount: Number(savingAmount),
      years: Number(years),
      rendite: renditeNumber / 100,
      dividendenRendite: Number(dividendenRendite) / 100 || 0,
      isMonthly: savingType === 'monthly',
      increaseEveryNYears: Number(increaseEveryNYears) || 0,
      increaseAmount: Number(increaseAmount) || 0,
      doubleMonths: doubleMonths || []
    })
  } catch (error) {
    console.error('Fehler bei der Berechnung:', error)
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Berechnungsfehler</div>
          <div>Bitte überprüfen Sie Ihre Eingaben.</div>
        </div>
      </div>
    )
  }

  // Debug-Ausgabe
  console.log('Prognose Data:', prognoseData)
  console.log('Metrics:', metrics)

  return (
    <div className="flex gap-4 w-full">
      {/* Metrics Panel */}
      <div className="flex flex-col gap-4" style={{ width: "220px" }}>
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
            Prognose-Basis
          </div>
          <div className="text-lg font-bold text-green-600">
            {rendite}% + {dividendenRendite || 0}% Div.
          </div>
        </div>

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
            Investiertes Kapital
          </div>
          <div className="text-lg font-bold text-gray-900">
            {metrics.totalInvested.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

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
            Gesamte Dividenden
          </div>
          <div className="text-lg font-bold text-black">
            {metrics.totalDividends.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

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
            Endkapital
          </div>
          <div className="text-lg font-bold text-green-600">
            {metrics.finalValue.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

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
            Endkapital abzgl. KESt
          </div>
          <div className="text-lg font-bold text-green-600">
            {metrics.netValueAfterKest.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

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
            Erwarteter Gewinn
          </div>
          <div className="text-lg font-bold text-green-600">
            {metrics.totalProfit.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ marginLeft: "20px" }}>
        <div
          className="p-6 rounded-[20px] shadow flex flex-col"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            border: "1px solid rgba(255,255,255,0.18)",
            height: "100%",
            minHeight: "550px", // Reduziert von 650px auf 550px
          }}
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Prognose: Vermögensentwicklung pro Jahr
          </h2>
          {prognoseData.length > 0 ? (
            <div className="flex-1 flex flex-col justify-end">
              {/* Einfacher DIV-basierter Chart - ganz unten ausgerichtet */}
              <div className="h-full gap-1 relative flex items-end" style={{ minHeight: "380px" }}> {/* Reduziert von 450px auf 380px */}
                <div className="flex items-end justify-between w-full h-full gap-1">
                  {prognoseData.map((d, i) => {
                    const maxValue = Math.max(...prognoseData.map(dp => dp.value))
                    const height = (d.value / maxValue) * 350 // Reduziert von 420px auf 350px
                    
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1 group relative h-full justify-end"
                      >
                        {/* Balken */}
                        <div
                          className="w-full min-w-[8px] rounded-t-sm cursor-pointer transition-colors"
                          style={{ 
                            height: `${Math.max(height, 2)}px`,
                            background: "linear-gradient(to top, #10b981, #34d399)",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                          }}
                          title={`Jahr ${d.year}: ${d.value.toLocaleString()}€`}
                          onMouseEnter={(e) => {
                            e.target.style.background = "linear-gradient(to top, #059669, #10b981)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "linear-gradient(to top, #10b981, #34d399)";
                          }}
                        />
                        
                        {/* Tooltip beim Hover */}
                        <div 
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                          style={{
                            background: "rgba(0, 0, 0, 0.8)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <div className="font-semibold">Jahr {d.year}</div>
                          <div className="text-green-300">
                            Depotwert: {d.value.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-gray-300">
                            Investiert: {d.invested.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-blue-300">
                            Dividenden: {d.yearlyDividends.toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-yellow-300">
                            Gewinn: {(d.value - d.invested).toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Keine Daten verfügbar - Prüfen Sie Ihre Eingaben
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrognoseCharts