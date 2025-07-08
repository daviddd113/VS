import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot
} from "recharts"
import { PriceTooltip, InvestmentTooltip } from './Tooltips'
import { calculatePriceTimeline } from '../utils/calculations'

function Charts({
  portfolioMode,
  portfolioAssets,
  assets,
  months,
  investmentTimeline,
  priceTimeline,
  buyOrderMonths,
  asset
}) {
  // Validierung der grundlegenden Daten
  if (!assets || !Array.isArray(assets)) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-yellow-100 border border-yellow-300">
          <div className="text-yellow-600 text-sm">
            Keine Asset-Daten verfügbar
          </div>
        </div>
      </div>
    )
  }

  // Validierung für Portfolio-Modus
  if (portfolioMode && (!portfolioAssets || !Array.isArray(portfolioAssets))) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-yellow-100 border border-yellow-300">
          <div className="text-yellow-600 text-sm">
            Portfolio-Daten werden geladen...
          </div>
        </div>
      </div>
    )
  }

  // Validierung der Timeline-Daten
  const hasValidInvestmentTimeline = investmentTimeline && Array.isArray(investmentTimeline) && investmentTimeline.length > 0
  const hasValidPriceTimeline = priceTimeline && Array.isArray(priceTimeline) && priceTimeline.length > 0

  return (
    <div className="space-y-4 w-full">
      {/* Portfolio Asset-Diagramme */}
      {portfolioMode && portfolioAssets.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 w-full">
          {portfolioAssets.filter(pa => pa.symbol && pa.allocation > 0).map((portfolioAsset, index) => {
            const assetData = assets.find(a => a.symbol === portfolioAsset.symbol);
            if (!assetData) return null;
            
            // Sichere Berechnung der Asset-Timeline
            let assetPriceTimeline = []
            try {
              assetPriceTimeline = calculatePriceTimeline({
                monthlyReturns: assetData.monthlyReturns?.slice(-months) || [],
                prices: assetData.monthlyPrices?.slice(-months-1) || []
              });
            } catch (error) {
              console.error('Fehler bei Asset-Timeline Berechnung:', error)
              return (
                <div 
                  key={portfolioAsset.symbol}
                  className="p-4 rounded-[20px] shadow flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    width: "300px",
                    minWidth: "300px",
                  }}
                >
                  <h3 className="text-sm font-semibold mb-3 text-center">
                    {assetData.name} ({portfolioAsset.allocation}%)
                  </h3>
                  <div className="text-center text-sm text-gray-600">
                    Diagramm-Daten nicht verfügbar
                  </div>
                </div>
              )
            }

            // Validierung der Timeline-Daten
            if (!assetPriceTimeline || assetPriceTimeline.length === 0) {
              return (
                <div 
                  key={portfolioAsset.symbol}
                  className="p-4 rounded-[20px] shadow flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    width: "300px",
                    minWidth: "300px",
                  }}
                >
                  <h3 className="text-sm font-semibold mb-3 text-center">
                    {assetData.name} ({portfolioAsset.allocation}%)
                  </h3>
                  <div className="text-center text-sm text-gray-600">
                    Keine Kursdaten verfügbar
                  </div>
                </div>
              )
            }

            return (
              <div 
                key={portfolioAsset.symbol}
                className="p-4 rounded-[20px] shadow flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  width: "300px",
                  minWidth: "300px",
                }}
              >
                <h3 className="text-sm font-semibold mb-3 text-center">
                  {assetData.name} ({portfolioAsset.allocation}%)
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={assetPriceTimeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Tooltip content={<PriceTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                      activeDot={{ r: 4, fill: `hsl(${index * 60}, 70%, 50%)`, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}

      {/* Haupt-Charts Box */}
      {hasValidInvestmentTimeline ? (
        <div className="space-y-4 w-full">
          {portfolioMode ? (
            // Portfolio Investment-Entwicklung
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
              <h2 className="text-xl font-semibold mb-4">Portfolio Investment-Entwicklung</h2>
              <ResponsiveContainer width="100%" height={480}>
                <LineChart data={investmentTimeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Tooltip content={<InvestmentTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                    activeDot={{ r: 6, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
                  />
                  {buyOrderMonths && buyOrderMonths.map(month => (
                    investmentTimeline[month] && (
                      <ReferenceDot
                        key={month}
                        x={month}
                        y={investmentTimeline[month]?.value}
                        r={3}
                        fill="#059669"
                        stroke="#059669"
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // Standard-Diagramme in separaten Boxen
            <>
              {hasValidPriceTimeline && (
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
                  <h2 className="text-xl font-semibold mb-2">Kursverlauf</h2>
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={priceTimeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <Tooltip content={<PriceTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false}
                        activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                      />
                      {buyOrderMonths && buyOrderMonths.map(month => (
                        priceTimeline[month] && (
                          <ReferenceDot
                            key={month}
                            x={month}
                            y={priceTimeline[month]?.price}
                            r={3}
                            fill="#2563eb"
                            stroke="#2563eb"
                          />
                        )
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
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
                <h2 className="text-xl font-semibold mb-2">Investment-Entwicklung</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={investmentTimeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Tooltip content={<InvestmentTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={false}
                      activeDot={{ r: 6, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
                    />
                    {buyOrderMonths && buyOrderMonths.map(month => (
                      investmentTimeline[month] && (
                        <ReferenceDot
                          key={month}
                          x={month}
                          y={investmentTimeline[month]?.value}
                          r={3}
                          fill="#059669"
                          stroke="#059669"
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          className="p-4 rounded-[20px] shadow w-full"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div className="text-center text-gray-600">
            <div className="text-lg font-semibold mb-2">Diagramme werden geladen...</div>
            <div className="text-sm">Bitte warten Sie, während die Daten berechnet werden.</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Charts
