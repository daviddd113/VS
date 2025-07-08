import React from 'react'
import { monthNames } from '../utils/helpers'

function Sidebar({
  startAmount,
  setStartAmount,
  savingType,
  setSavingType,
  savingAmount,
  setSavingAmount,
  years,
  setYears,
  maxYears,
  assets,
  asset,
  setAsset,
  portfolioMode,
  setPortfolioMode,
  portfolioAssets,
  setPortfolioAssets,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths,
  setShowAdvancedSettings,
  collapsed,
  setCollapsed
}) {
  const handleStartAmountChange = (e) => {
    const value = Number(e.target.value) || 0;
    setStartAmount(value);
  };

  const handleSavingTypeChange = (e) => {
    setSavingType(e.target.value)
  }

  const handleSavingAmountChange = (e) => {
    const value = Number(e.target.value) || 0
    setSavingAmount(value)
  }

  const handleYearsChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setYears(Math.min(Math.max(1, value), maxYears))
  }

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 shadow-2xl flex flex-col gap-4 transition-all duration-300 ease-in-out
        bg-white/90 md:bg-[rgba(255,255,255,0.1)] md:backdrop-blur-[40px] md:saturate-200`}
      style={{
        margin: "0",
        minWidth: collapsed ? "44px" : "88vw",
        width: collapsed ? "44px" : "92vw",
        maxWidth: "360px",
        height: "100vh",
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(40px) saturate(200%)",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        overflow: "hidden",
        left: 0,
        transition: "transform 0.3s cubic-bezier(.4,2,.6,1), width 0.3s cubic-bezier(.4,2,.6,1)",
        transform: collapsed ? "translateX(-100%)" : "translateX(0)",
      }}
    >
      {/* Collapse Button: Mobil ausgeblendet */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-3 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hidden md:flex"
        style={{
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          padding: 0,
        }}
      >
        <span
          className="block w-full h-full flex items-center justify-center text-gray-700 text-2xl font-normal leading-none"
          style={{ position: "relative", top: "-2px" }}
        >
          {collapsed ?  "›" : "‹"}
        </span>
      </button>

      {/* Collapsed State */}
      {collapsed ? (
        <div className="flex flex-col items-center justify-center h-full p-2">
          {/* Keine vertikale Überschrift mehr */}
        </div>
      ) : (
        <form className="flex flex-col gap-4 p-4 md:p-6 h-full overflow-y-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Historische Daten</h2>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">Startkapital (optional)</span>
            <input
              type="number"
              className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              value={startAmount}
              onChange={handleStartAmountChange}
              min={0}
              placeholder="z.B. 1000"
            />
          </label>
          
          <label className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">Sparrate</span>
            <select
              className="select w-full transition-all rounded-2xl text-center border-0 outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              value={savingType}
              onChange={handleSavingTypeChange}
            >
              <option value="">Bitte wählen...</option>
              <option value="monthly">Monatlich</option>
              <option value="yearly">Jährlich</option>
            </select>
          </label>

          {/* Animiertes Eingabefeld */}
          <div
            className="transition-all duration-300 ease-in-out overflow-hidden"
            style={{
              maxHeight: savingType ? '100px' : '0',
              opacity: savingType ? 1 : 0,
              marginTop: savingType ? '0' : '-1rem'
            }}
          >
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">
                {savingType === 'monthly' ? 'Monatliche' : 'Jährliche'} Sparrate (€)
              </span>
              <input
                type="number"
                className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
                value={savingAmount}
                onChange={handleSavingAmountChange}
                min={0}
                placeholder="z.B. 100"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">Jahre</span>
            <input
              type="number"
              className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              value={years}
              onChange={handleYearsChange}
              min={1}
              placeholder="z.B. 20"
            />
          </label>

          {/* Erweiterte Einstellungen als separate Felder */}
          {(increaseEveryNYears || increaseAmount) && (
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Automatische Erhöhung</span>
              <input
                type="text"
                className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
                value={`Alle ${increaseEveryNYears} Jahre um ${increaseAmount}€`}
                readOnly
              />
            </label>
          )}

          {doubleMonths.length > 0 && (
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Doppelte Einzahlung</span>
              <input
                type="text"
                className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
                value={doubleMonths.map(month => monthNames[month - 1]).join(', ')}
                readOnly
              />
            </label>
          )}

          {/* Portfolio oder Asset-Auswahl - DIREKT über dem Button */}
          {portfolioMode ? (
            // Portfolio-Assets Anzeige
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Portfolio Assets</span>
              <div className="space-y-2">
                {portfolioAssets.filter(pa => pa.symbol && pa.allocation > 0).length > 0 ? (
                  portfolioAssets
                    .filter(pa => pa.symbol && pa.allocation > 0)
                    .map((portfolioAsset, index) => {
                      const assetData = assets.find(a => a.symbol === portfolioAsset.symbol);
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 rounded-2xl"
                          style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">
                              {assetData?.name || portfolioAsset.symbol}
                            </div>
                            <div className="text-xs text-gray-600">
                              ({portfolioAsset.symbol})
                            </div>
                          </div>
                          <div 
                            className="px-3 py-1 rounded-lg font-bold text-sm"
                            style={{
                              background: "rgba(255, 255, 255, 0.3)",
                              color: "#374151",
                            }}
                          >
                            {portfolioAsset.allocation}%
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div 
                    className="p-3 rounded-2xl text-center text-gray-600 text-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    Keine Assets ausgewählt
                  </div>
                )}
                
                {/* Gesamt-Prozentsatz */}
                {portfolioAssets.filter(pa => pa.symbol && pa.allocation > 0).length > 0 && (
                  <div 
                    className="flex items-center justify-between p-2 rounded-xl mt-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <span className="font-medium text-gray-700 text-sm">Gesamt:</span>
                    <span 
                      className={`font-bold text-sm ${
                        portfolioAssets.reduce((sum, asset) => sum + (asset.allocation || 0), 0) === 100 
                          ? 'text-gray-700' 
                          : 'text-gray-600'
                      }`}
                    >
                      {portfolioAssets.reduce((sum, asset) => sum + (asset.allocation || 0), 0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Standard Asset-Auswahl
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Aktie/ETF</span>
              <select
                className="select w-full transition-all rounded-2xl text-center border-0 outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
                value={asset?.symbol || ''}
                onChange={(e) => {
                  const selected = assets.find(a => a.symbol === e.target.value)
                  setAsset(selected)
                }}
              >
                <option value="">Bitte wählen...</option>
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.name} ({a.symbol})
                  </option>
                ))}
              </select>
            </label>
          )}

          <div
            onClick={() => setShowAdvancedSettings(true)}
            className="mt-2 w-full py-2 rounded-2xl font-medium text-gray-700 cursor-pointer text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            Erweiterte Einstellungen
          </div>
        </form>
      )}
    </aside>
  )
}

export default Sidebar
