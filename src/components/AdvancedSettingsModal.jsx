import React, { useState } from 'react'
import { monthNames } from '../utils/helpers'

function AdvancedSettingsModal({
  showAdvancedSettings,
  setShowAdvancedSettings,
  increaseEveryNYears,
  setIncreaseEveryNYears,
  increaseAmount,
  setIncreaseAmount,
  doubleMonths,
  setDoubleMonths,
  portfolioMode,
  setPortfolioMode,
  portfolioAssets,
  setPortfolioAssets,
  assets,
  prognoseMode // Neuer Prop
}) {
  const [showIncreaseSection, setShowIncreaseSection] = useState(false)
  const [showDoublePaymentSection, setShowDoublePaymentSection] = useState(false)
  const [showPortfolioSection, setShowPortfolioSection] = useState(false)

  if (!showAdvancedSettings) return null

  const handleClose = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.close-button')) {
      e.preventDefault();
      e.stopPropagation();
      setShowAdvancedSettings(false);
      setShowIncreaseSection(false);
      setShowDoublePaymentSection(false);
      setShowPortfolioSection(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      style={{ zIndex: 9999 }}
      onClick={handleClose}
    >
      <div 
        className="rounded-3xl p-8 w-[600px] mx-4 shadow-2xl relative"
        style={{ 
          zIndex: 10000,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Erweiterte Einstellungen</h2>
          <button 
            onClick={handleClose}
            className="close-button p-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
            type="button"
          >
            <span className="text-gray-700 font-bold text-lg">✕</span>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Sparrate automatisch erhöhen - Aufklappbar */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              onClick={() => setShowIncreaseSection(!showIncreaseSection)}
            >
              <label className="font-semibold text-gray-800 text-lg cursor-pointer">
                Sparrate automatisch erhöhen
              </label>
              <div 
                className={`transform transition-transform duration-300 ${showIncreaseSection ? 'rotate-180' : 'rotate-0'}`}
                style={{ fontSize: '16px', color: '#000000ff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>
            
            {/* Animierter Container für Felder */}
            <div 
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showIncreaseSection ? '200px' : '0',
                opacity: showIncreaseSection ? 1 : 0,
              }}
            >
              <div 
                className="flex items-center gap-3 p-4 mt-2 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                <span className="text-gray-700 font-medium">Alle</span>
                <input
                  type="number"
                  className="w-20 px-3 py-2 rounded-xl text-center border-0 outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                  value={increaseEveryNYears}
                  onChange={(e) => setIncreaseEveryNYears(e.target.value)}
                  min="1"
                  placeholder="3"
                />
                <select
                  className="px-3 py-2 rounded-xl border-0 outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                  value="Jahre"
                  onChange={() => {}}
                >
                  <option value="Monate">Monate</option>
                  <option value="Jahre">Jahre</option>
                </select>
                <span className="text-gray-700 font-medium">Erhöhung um</span>
                <input
                  type="number"
                  className="w-24 px-3 py-2 rounded-xl text-center border-0 outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                  value={increaseAmount}
                  onChange={(e) => setIncreaseAmount(e.target.value)}
                  min="0"
                  placeholder="50"
                />
                <span className="text-gray-700 font-medium">€</span>
              </div>
            </div>
          </div>

          {/* Portfolio/Sparplan - Aufklappbar - NUR im historischen Modus */}
          {!prognoseMode && (
            <div className="space-y-2">
              <div 
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
                onClick={() => setShowPortfolioSection(!showPortfolioSection)}
              >
                <label className="font-semibold text-gray-800 text-lg cursor-pointer">
                  Portfolio/Sparplan
                </label>
                <div 
                  className={`transform transition-transform duration-300 ${showPortfolioSection ? 'rotate-180' : 'rotate-0'}`}
                  style={{ fontSize: '16px', color: '#000000ff' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Animierter Container für Portfolio */}
              <div 
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: showPortfolioSection ? '500px' : '0',
                  opacity: showPortfolioSection ? 1 : 0,
                }}
              >
                <div className="mt-2 space-y-4">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="portfolioMode"
                        checked={portfolioMode}
                        onChange={(e) => {
                          setPortfolioMode(e.target.checked);
                          if (!e.target.checked) {
                            setPortfolioAssets([]);
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <label htmlFor="portfolioMode" className="font-medium text-gray-700">
                        Portfolio-Modus aktivieren
                      </label>
                    </div>
                    
                    {portfolioMode && (
                      <div className="space-y-3">
                        {portfolioAssets.map((portfolioAsset, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                          >
                            <select
                              className="flex-1 px-3 py-2 rounded-lg border-0 outline-none"
                              style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                backdropFilter: "blur(5px)",
                                WebkitBackdropFilter: "blur(5px)",
                              }}
                              value={portfolioAsset.symbol}
                              onChange={(e) => {
                                const newAssets = [...portfolioAssets];
                                const selectedAsset = assets.find(a => a.symbol === e.target.value);
                                newAssets[index] = { ...newAssets[index], ...selectedAsset };
                                setPortfolioAssets(newAssets);
                              }}
                            >
                              <option value="">Asset wählen...</option>
                              {assets.map((a) => (
                                <option key={a.symbol} value={a.symbol}>
                                  {a.name} ({a.symbol})
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              className="w-20 px-3 py-2 rounded-lg text-center border-0 outline-none"
                              style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                backdropFilter: "blur(5px)",
                                WebkitBackdropFilter: "blur(5px)",
                              }}
                              value={portfolioAsset.allocation || ''}
                              onChange={(e) => {
                                const newAssets = [...portfolioAssets];
                                newAssets[index].allocation = Number(e.target.value);
                                setPortfolioAssets(newAssets);
                              }}
                              min="0"
                              max="100"
                              placeholder="0"
                            />
                            <span className="text-gray-700 font-medium">%</span>
                            <button
                              onClick={() => {
                                const newAssets = portfolioAssets.filter((_, i) => i !== index);
                                setPortfolioAssets(newAssets);
                              }}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-100/20 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => {
                              setPortfolioAssets([...portfolioAssets, { symbol: '', allocation: 0 }]);
                            }}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              background: "rgba(59, 130, 246, 0.2)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              color: "#1d4ed8",
                            }}
                          >
                            + Asset hinzufügen
                          </button>
                          <div className="text-sm font-medium text-gray-700">
                            Gesamt: {portfolioAssets.reduce((sum, asset) => sum + (asset.allocation || 0), 0)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doppelte Einzahlung - Aufklappbar */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              onClick={() => setShowDoublePaymentSection(!showDoublePaymentSection)}
            >
              <label className="font-semibold text-gray-800 text-lg cursor-pointer">
                Doppelte Einzahlung in Monaten
              </label>
              <div 
                className={`transform transition-transform duration-300 ${showDoublePaymentSection ? 'rotate-180' : 'rotate-0'}`}
                style={{ fontSize: '16px', color: '#000000ff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>
            
            {/* Animierter Container für Monatsauswahl */}
            <div 
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showDoublePaymentSection ? '400px' : '0',
                opacity: showDoublePaymentSection ? 1 : 0,
              }}
            >
              <div className="mt-2">
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <div
                      key={month}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 text-center select-none hover:scale-105 active:scale-95 ${
                        doubleMonths.includes(month)
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}
                      style={{
                        background: doubleMonths.includes(month) 
                          ? "rgba(59, 130, 246, 0.2)" 
                          : "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: doubleMonths.includes(month)
                          ? "inset 0 1px 3px rgba(59, 130, 246, 0.2), 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.3)"
                          : "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (doubleMonths.includes(month)) {
                          setDoubleMonths(doubleMonths.filter(m => m !== month));
                        } else {
                          setDoubleMonths([...doubleMonths, month].sort((a, b) => a - b));
                        }
                      }}
                    >
                      <span className="font-medium">
                        {monthNames[month - 1]}
                      </span>
                      {doubleMonths.includes(month) && (
                        <div className="absolute top-2 right-2 text-blue-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(59, 130, 246, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          >
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSettingsModal