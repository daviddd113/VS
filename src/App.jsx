import React, { useState, useEffect, useRef } from "react"
import Sidebar from './components/Sidebar'
import PrognoseSidebar from './components/PrognoseSidebar'
import MetricsPanel from './components/MetricsPanel'
import Charts from './components/Charts'
import PrognoseCharts from './components/PrognoseCharts'
import AdvancedSettingsModal from './components/AdvancedSettingsModal'
import { 
  calculateInvestmentWithMonthlyReturns,
  calculateInvestmentTimeline,
  calculatePriceTimeline,
  calculatePortfolioReturns
} from './utils/calculations'

function App() {
  const [assets, setAssets] = useState([])
  const [asset, setAsset] = useState(null)
  const [startAmount, setStartAmount] = useState("")
  const [savingType, setSavingType] = useState("")
  const [savingAmount, setSavingAmount] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [years, setYears] = useState("")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [increaseEveryNYears, setIncreaseEveryNYears] = useState("")
  const [increaseAmount, setIncreaseAmount] = useState("")
  const [doubleMonths, setDoubleMonths] = useState([])
  
  // Portfolio States
  const [portfolioMode, setPortfolioMode] = useState(false)
  const [portfolioAssets, setPortfolioAssets] = useState([])

  // Neue Prognose States
  const [prognoseMode, setPrognoseMode] = useState(false)
  const [prognoseStartAmount, setPrognoseStartAmount] = useState("")
  const [prognoseSavingType, setPrognoseSavingType] = useState("")
  const [prognoseSavingAmount, setPrognoseSavingAmount] = useState("")
  const [prognoseYears, setPrognoseYears] = useState("")
  const [prognoseRendite, setPrognoseRendite] = useState("")
  const [prognoseDividendenRendite, setPrognoseDividendenRendite] = useState("")
  const [prognoseIncreaseEveryNYears, setPrognoseIncreaseEveryNYears] = useState("")
  const [prognoseIncreaseAmount, setPrognoseIncreaseAmount] = useState("")
  const [prognoseDoubleMonths, setPrognoseDoubleMonths] = useState([])

  // Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const maxYears = asset ? Math.floor(asset.monthlyReturns?.length / 12) : 40

  const [circleAnim, setCircleAnim] = useState({ t: 0 })
  const animRef = useRef()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    let running = true
    let lastTime = 0
    
    function animate(currentTime) {
      if (!running) return
      
      if (currentTime - lastTime >= 33) {
        setCircleAnim((prev) => ({ t: prev.t + 0.008 }))
        lastTime = currentTime
      }
      
      animRef.current = requestAnimationFrame(animate)
    }
    
    animRef.current = requestAnimationFrame(animate)
    
    return () => {
      running = false
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [reducedMotion])

  useEffect(() => {
    window._startAmount = Number(startAmount)
    window._amount = Number(savingAmount)
    window._isMonthly = savingType === 'monthly'
    window._increaseEveryNYears = Number(increaseEveryNYears) || 0
    window._increaseAmount = Number(increaseAmount) || 0
    window._doubleMonths = doubleMonths
  }, [startAmount, savingAmount, savingType, increaseEveryNYears, increaseAmount, doubleMonths])

  useEffect(() => {
    const apiUrl = 'https://turbo-guacamole-6949xg77wp4g35xrw-4000.app.github.dev/api/assets';
    
    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      setAssets(data);
      setAsset(data[0]);
      setLoading(false);
      setError(null);
    })
    .catch(err => {
      setError(`Fehler beim Laden: ${err.message}`);
      setLoading(false);
    });
  }, [])

  useEffect(() => {
    if (!savingAmount || !years) return;
    
    try {
      let monthlyReturns = []
      const months = Number(years) * 12;
      
      if (portfolioMode && portfolioAssets.length > 0) {
        monthlyReturns = calculatePortfolioReturns(portfolioAssets, assets, months)
        if (monthlyReturns.length === 0) return;
      } else if (asset) {
        monthlyReturns = asset.monthlyReturns.slice(-months);
      } else {
        return;
      }
      
      const isMonthly = savingType === 'monthly';
      
      const total = calculateInvestmentWithMonthlyReturns({
        startAmount: Number(startAmount) || 0,
        amount: Number(savingAmount),
        monthlyReturns,
        isMonthly,
        increaseEveryNYears: Number(increaseEveryNYears) || 0,
        increaseAmount: Number(increaseAmount) || 0,
        doubleMonths
      });
      setResult(total);
    } catch (error) {
      console.error('Fehler bei der Investment-Berechnung:', error);
      setResult(null);
    }
  }, [asset, portfolioAssets, portfolioMode, assets, startAmount, savingAmount, savingType, years, increaseEveryNYears, increaseAmount, doubleMonths]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Lade Asset-Daten...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Fehler beim Laden der Asset-Daten: {error}
      </div>
    )
  }

  const months = years * 12
  
  // Berechne Timeline-Daten mit Error Handling
  let monthlyReturns = []
  let investmentTimeline = []
  let priceTimeline = []
  let buyOrderMonths = []
  
  try {
    if (portfolioMode && portfolioAssets.length > 0) {
      monthlyReturns = calculatePortfolioReturns(portfolioAssets, assets, months)
      if (monthlyReturns.length > 0) {
        investmentTimeline = calculateInvestmentTimeline({
          startAmount,
          amount: savingAmount,
          monthlyReturns,
          isMonthly: savingType === 'monthly',
          increaseEveryNYears: Number(increaseEveryNYears) || 0,
          increaseAmount: Number(increaseAmount) || 0,
          doubleMonths
        })
        buyOrderMonths = Array.from({ length: years }, (_, i) => i * 12)
      }
    } else if (asset) {
      monthlyReturns = asset.monthlyReturns?.slice(-months) || []
      const prices = asset.monthlyPrices?.slice(-months-1) || []
      
      investmentTimeline = calculateInvestmentTimeline({
        startAmount,
        amount: savingAmount,
        monthlyReturns,
        isMonthly: savingType === 'monthly',
        increaseEveryNYears: Number(increaseEveryNYears) || 0,
        increaseAmount: Number(increaseAmount) || 0,
        doubleMonths
      })
      
      priceTimeline = calculatePriceTimeline({
        monthlyReturns,
        prices: prices
      })
      
      buyOrderMonths = Array.from({ length: years }, (_, i) => i * 12)
    }
  } catch (error) {
    console.error('Fehler bei der Timeline-Berechnung:', error);
    // Setze leere Arrays als Fallback
    investmentTimeline = []
    priceTimeline = []
    buyOrderMonths = []
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="pointer-events-none select-none"
        style={{
          position: "fixed",
          zIndex: 0,
          inset: 0,
          opacity: reducedMotion ? 0.3 : 1,
        }}
      >
        {/* Blue Circle */}
        <div
          style={{
            position: "absolute",
            top: `${-80 + Math.sin(circleAnim.t) * 200}px`,
            left: `${-80 + Math.cos(circleAnim.t / 2) * 400}px`,
            width: "400px",
            height: "400px",
            background: "#2563eb",
            opacity: 0.4,
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(120px)",
            zIndex: 0,
            transform: "translateZ(0)",
            willChange: reducedMotion ? "auto" : "transform",
            backfaceVisibility: "hidden",
          }}
        />
        
        {/* Green Circle Bottom Right */}
        <div
          style={{
            position: "absolute",
            bottom: `${-60 + Math.cos(circleAnim.t / 1.5) * 200}px`,
            right: `${-60 + Math.sin(circleAnim.t / 1.2) * 400}px`,
            width: "600px",
            height: "600px",
            background: "#059669",
            opacity: 0.4,
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(98px)",
            zIndex: 0,
            transform: "translateZ(0)",
            willChange: reducedMotion ? "auto" : "transform",
            backfaceVisibility: "hidden",
          }}
        />
        
        {/* Green Circle Middle Right */}
        <div
          style={{
            position: "absolute",
            top: `calc(45% + ${Math.sin(circleAnim.t / 1.7) * 200}px)`,
            left: `calc(65% + ${Math.cos(circleAnim.t / 1.3) * 300}px)`,
            width: "400px",
            height: "400px",
            background: "#34d399",
            opacity: 0.3,
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(48px)",
            transform: "translate(-50%, -50%) translateZ(0)",
            zIndex: 0,
            willChange: reducedMotion ? "auto" : "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </div>

      {/* Toggle Button */}
      <div 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20 flex rounded-full overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          paddingLeft: "4px",
          paddingRight: "1px",
        }}
      >
        <div
          className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out"
          style={{
            background: prognoseMode 
              ? "linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.8))" 
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.8))",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            left: prognoseMode ? "calc(65% - 2px)" : "6px",
            width: prognoseMode ? "calc(35% - 2px)" : "calc(65% - 2px)",
            transform: "translateZ(0)",
          }}
        />
        <button
          onClick={() => setPrognoseMode(false)}
          className={`py-2 font-medium transition-all duration-200 relative z-10 ${
            !prognoseMode ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            width: "65%",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          Historische Daten
        </button>
        <button
          onClick={() => setPrognoseMode(true)}
          className={`py-2 font-medium transition-all duration-200 relative z-10 ${
            prognoseMode ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            width: "35%",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
          }}
        >
          Prognose
        </button>
      </div>

      <div className="flex w-full max-w-5xl gap-8 items-start justify-center relative z-10">
        {prognoseMode ? (
          <PrognoseSidebar
            startAmount={prognoseStartAmount}
            setStartAmount={setPrognoseStartAmount}
            savingType={prognoseSavingType}
            setSavingType={setPrognoseSavingType}
            savingAmount={prognoseSavingAmount}
            setSavingAmount={setPrognoseSavingAmount}
            years={prognoseYears}
            setYears={setPrognoseYears}
            rendite={prognoseRendite}
            setRendite={setPrognoseRendite}
            dividendenRendite={prognoseDividendenRendite}
            setDividendenRendite={setPrognoseDividendenRendite}
            increaseEveryNYears={prognoseIncreaseEveryNYears}
            setIncreaseEveryNYears={setPrognoseIncreaseEveryNYears}
            increaseAmount={prognoseIncreaseAmount}
            setIncreaseAmount={setPrognoseIncreaseAmount}
            doubleMonths={prognoseDoubleMonths}
            setDoubleMonths={setPrognoseDoubleMonths}
            setShowAdvancedSettings={setShowAdvancedSettings}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        ) : (
          <Sidebar
            startAmount={startAmount}
            setStartAmount={setStartAmount}
            savingType={savingType}
            setSavingType={setSavingType}
            savingAmount={savingAmount}
            setSavingAmount={setSavingAmount}
            years={years}
            setYears={setYears}
            maxYears={maxYears}
            assets={assets}
            asset={asset}
            setAsset={setAsset}
            portfolioMode={portfolioMode}
            setPortfolioMode={setPortfolioMode}
            portfolioAssets={portfolioAssets}
            setPortfolioAssets={setPortfolioAssets}
            increaseEveryNYears={increaseEveryNYears}
            increaseAmount={increaseAmount}
            doubleMonths={doubleMonths}
            setShowAdvancedSettings={setShowAdvancedSettings}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        )}

        <div className="flex-1 flex flex-col items-center" style={{ 
          marginLeft: sidebarCollapsed ? "80px" : "260px",
          transition: "margin-left 0.3s ease-in-out"
        }}>
          {prognoseMode ? (
            <PrognoseCharts
              startAmount={prognoseStartAmount}
              savingType={prognoseSavingType}
              savingAmount={prognoseSavingAmount}
              years={prognoseYears}
              rendite={prognoseRendite}
              dividendenRendite={prognoseDividendenRendite}
              increaseEveryNYears={prognoseIncreaseEveryNYears}
              increaseAmount={prognoseIncreaseAmount}
              doubleMonths={prognoseDoubleMonths}
            />
          ) : (
            result ? (
              <div className="flex gap-4 w-full">
                {/* Metrics Panel mit fester Breite wie in Prognose */}
                <div className="flex flex-col gap-4" style={{ width: "220px" }}>
                  <MetricsPanel
                    portfolioMode={portfolioMode}
                    asset={asset}
                    result={result}
                    years={years}
                    startAmount={startAmount}
                    savingAmount={savingAmount}
                    savingType={savingType}
                    increaseEveryNYears={increaseEveryNYears}
                    increaseAmount={increaseAmount}
                    doubleMonths={doubleMonths}
                  />
                </div>

                {/* Charts mit Abstand wie in Prognose */}
                <div className="flex-1" style={{ marginLeft: "20px" }}>
                  <Charts
                    portfolioMode={portfolioMode}
                    portfolioAssets={portfolioAssets}
                    assets={assets}
                    months={months}
                    investmentTimeline={investmentTimeline}
                    priceTimeline={priceTimeline}
                    buyOrderMonths={buyOrderMonths}
                    asset={asset}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <div className="text-xl font-semibold mb-2">Keine Daten verfügbar</div>
                  <div>Bitte füllen Sie alle Felder aus, um eine Analyse zu sehen.</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      
      <AdvancedSettingsModal
        showAdvancedSettings={showAdvancedSettings}
        setShowAdvancedSettings={setShowAdvancedSettings}
        increaseEveryNYears={prognoseMode ? prognoseIncreaseEveryNYears : increaseEveryNYears}
        setIncreaseEveryNYears={prognoseMode ? setPrognoseIncreaseEveryNYears : setIncreaseEveryNYears}
        increaseAmount={prognoseMode ? prognoseIncreaseAmount : increaseAmount}
        setIncreaseAmount={prognoseMode ? setPrognoseIncreaseAmount : setIncreaseAmount}
        doubleMonths={prognoseMode ? prognoseDoubleMonths : doubleMonths}
        setDoubleMonths={prognoseMode ? setPrognoseDoubleMonths : setDoubleMonths}
        portfolioMode={portfolioMode}
        setPortfolioMode={setPortfolioMode}
        portfolioAssets={portfolioAssets}
        setPortfolioAssets={setPortfolioAssets}
        assets={assets}
        prognoseMode={prognoseMode}
      />
    </div>
  )
}


export default App

