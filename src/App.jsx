import React, { useState, useEffect, useRef } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot
} from "recharts"

function calculateInvestmentWithMonthlyReturns({ 
  startAmount, 
  amount, 
  monthlyReturns, 
  isMonthly,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths 
}) {
  let total = Number(startAmount)
  let baseAmount = Number(amount)
  
  for (let i = 0; i < monthlyReturns.length; i++) {
    const currentMonth = i % 12
    
    // Prüfe ob wir die Sparrate erhöhen müssen
    if (increaseEveryNYears && increaseAmount && i > 0 && i % (increaseEveryNYears * 12) === 0) {
      baseAmount += Number(increaseAmount)
    }
    
    // Aktueller Sparbetrag
    let currentAmount = baseAmount
    
    // Prüfe ob dieser Monat doppelt eingezahlt wird
    if (doubleMonths?.includes(currentMonth + 1)) {
      currentAmount *= 2
    }
    
    const contribution = isMonthly ? currentAmount : (i % 12 === 0 ? currentAmount : 0)
    total = total * (1 + monthlyReturns[i]) + contribution
  }
  return total
}

function calculatePriceTimeline({ monthlyReturns, prices }) {
  return prices.map((price, i) => ({
    month: i,                    // Monatszähler
    price: price,               // Tatsächlicher Preis
    startPrice: prices[0],      // Erster Preis der Periode
    totalMonths: prices.length - 1  // Gesamtanzahl Monate
  }));
}

function calculateInvestmentTimeline({ 
  startAmount, 
  amount, 
  monthlyReturns, 
  isMonthly,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths 
}) {
  const timeline = []
  let total = Number(startAmount)
  let baseAmount = Number(amount)
  
  timeline.push({ 
    month: 0, 
    value: total,
    totalMonths: monthlyReturns.length 
  })
  
  for (let i = 0; i < monthlyReturns.length; i++) {
    // Sparratenerhöhung
    if (increaseEveryNYears && increaseAmount && i > 0 && i % (increaseEveryNYears * 12) === 0) {
      baseAmount += Number(increaseAmount)
    }
    
    // Aktueller Monatsbetrag
    let currentAmount = baseAmount
    if (doubleMonths?.includes((i % 12) + 1)) {
      currentAmount *= 2
    }
    
    const contribution = isMonthly ? currentAmount : (i % 12 === 0 ? currentAmount : 0)
    total = total * (1 + monthlyReturns[i]) + contribution
    
    timeline.push({ 
      month: i + 1, 
      value: total,
      totalMonths: monthlyReturns.length 
    })
  }
  
  return timeline
}

function getDateFromMonth(month, totalMonths) {
  const date = new Date()
  date.setMonth(date.getMonth() - totalMonths)
  date.setMonth(date.getMonth() + month)
  return date.toLocaleDateString('de-DE', { 
    month: 'long',
    year: 'numeric'
  })
}

function yearTickFormatter(month) {
  if (month % 12 === 0) {
    return `Jahr ${month / 12 + 1}`
  }
  return ""
}

function dollarFormatter(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })
}

function PriceTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const totalMonths = payload[0].payload?.totalMonths ?? 0
    const date = getDateFromMonth(label, totalMonths)
    const currentPrice = payload[0].value
    const startPrice = payload[0].payload?.startPrice ?? currentPrice
    const totalReturn = ((currentPrice - startPrice) / startPrice * 100).toFixed(2)
    const returnColor = totalReturn >= 0 ? "#16a34a" : "#dc2626" // Grün oder Rot
    
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

function InvestmentTooltip({ active, payload, label }) {
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

function calculateMetrics({ startAmount, amount, years, result, isMonthly, increaseEveryNYears, increaseAmount, doubleMonths }) {
  let totalContributions = 0;
  let currentAmount = amount;
  
  for (let year = 0; year < years; year++) {
    // Prüfe ob die Sparrate erhöht werden muss
    if (increaseEveryNYears && increaseAmount && year > 0 && year % increaseEveryNYears === 0) {
      currentAmount += Number(increaseAmount);
    }
    
    if (isMonthly) {
      for (let month = 1; month <= 12; month++) {
        let monthlyContribution = currentAmount;
        // Prüfe ob dieser Monat eine doppelte Einzahlung hat
        if (doubleMonths?.includes(month)) {
          monthlyContribution *= 2;
        }
        totalContributions += monthlyContribution;
      }
    } else {
      totalContributions += currentAmount;
    }
  }
  
  const invested = Number(startAmount) + totalContributions;
  const profit = result - invested;
  const profitPercentage = ((result / invested - 1) * 100).toFixed(1);
  const avgYearlyReturn = ((Math.pow(result / invested, 1 / years) - 1) * 100).toFixed(1);
  
  return {
    invested,
    profit,
    profitPercentage,
    avgYearlyReturn
  };
}

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

// Neue Funktion zur Berechnung der Portfolio-Renditen
function calculatePortfolioReturns(portfolioAssets, assets, months) {
  if (!portfolioAssets || portfolioAssets.length === 0) return []
  
  // Filtere nur Assets mit gültigen Daten und Allocation > 0
  const validAssets = portfolioAssets.filter(pa => {
    const assetData = assets.find(a => a.symbol === pa.symbol)
    return assetData && pa.allocation > 0
  })
  
  if (validAssets.length === 0) return []
  
  // Stelle sicher, dass die Summe der Allocations 100% ergibt (oder normalisiere)
  const totalAllocation = validAssets.reduce((sum, pa) => sum + pa.allocation, 0)
  if (totalAllocation === 0) return []
  
  // Bestimme die maximale Anzahl verfügbarer Monate
  let maxAvailableMonths = months
  validAssets.forEach(pa => {
    const assetData = assets.find(a => a.symbol === pa.symbol)
    if (assetData && assetData.monthlyReturns) {
      maxAvailableMonths = Math.min(maxAvailableMonths, assetData.monthlyReturns.length)
    }
  })
  
  const portfolioReturns = []
  
  // Berechne gewichtete Renditen für jeden Monat
  for (let month = 0; month < maxAvailableMonths; month++) {
    let weightedReturn = 0
    
    validAssets.forEach(pa => {
      const assetData = assets.find(a => a.symbol === pa.symbol)
      if (assetData && assetData.monthlyReturns && assetData.monthlyReturns[assetData.monthlyReturns.length - maxAvailableMonths + month] !== undefined) {
        const monthlyReturn = assetData.monthlyReturns[assetData.monthlyReturns.length - maxAvailableMonths + month]
        const weight = pa.allocation / totalAllocation // Normalisiere die Gewichtung
        weightedReturn += monthlyReturn * weight
      }
    })
    
    portfolioReturns.push(weightedReturn)
  }
  
  return portfolioReturns
}

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
  const [doubleMonths, setDoubleMonths] = useState([])  // [1-12] für die Monate
  const [clickCount, setClickCount] = useState(0)
  const [count, setCount] = useState(0)
  
  // Neue States für Aufklapp-Funktionalität
  const [showIncreaseSection, setShowIncreaseSection] = useState(false)
  const [showDoublePaymentSection, setShowDoublePaymentSection] = useState(false)
  const [showPortfolioSection, setShowPortfolioSection] = useState(false)
  
  // Neue States für Portfolio/Sparplan
  const [portfolioMode, setPortfolioMode] = useState(false)
  const [portfolioAssets, setPortfolioAssets] = useState([])

  // Monatsnamen-Array hinzufügen
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Entferne die alten Modal-States
  // const [modalLocalDoubleMonths, setModalLocalDoubleMonths] = useState([]);
  // const [modalLocalIncreaseYears, setModalLocalIncreaseYears] = useState("");
  // const [modalLocalIncreaseAmount, setModalLocalIncreaseAmount] = useState("");

  const maxYears = asset ? Math.floor(asset.monthlyReturns?.length / 12) : 40

  const [circleAnim, setCircleAnim] = useState({
    t: 0,
  })
  const animRef = useRef()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Prüfe auf reduced motion preference
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
      
      // Reduziere auf 30fps für bessere Performance
      if (currentTime - lastTime >= 33) {
        setCircleAnim((prev) => ({
          t: prev.t + 0.008, // Langsamere Animation
        }))
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
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors'
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      console.log("Empfangene Daten:", data); // Debug-Ausgabe
      setAssets(data);
      setAsset(data[0]);
      setLoading(false);
      setError(null);
    })
    .catch(err => {
      console.error("API-Fehler:", err);
      setError(`Fehler beim Laden: ${err.message}`);
      setLoading(false);
    });
  }, [])

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

  useEffect(() => {
    // Nur berechnen wenn wir alle notwendigen Daten haben
    if (!savingAmount || !years) return;
    
    let monthlyReturns = []
    const months = Number(years) * 12;
    
    if (portfolioMode && portfolioAssets.length > 0) {
      // Portfolio-Modus: Verwende gewichtete Renditen
      monthlyReturns = calculatePortfolioReturns(portfolioAssets, assets, months)
      if (monthlyReturns.length === 0) return; // Keine gültigen Portfolio-Daten
    } else if (asset) {
      // Standard-Modus: Verwende Asset-Renditen
      monthlyReturns = asset.monthlyReturns.slice(-months);
    } else {
      return; // Keine Daten verfügbar
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
  
  // Dynamische Berechnung der Renditen und Timeline
  let monthlyReturns = []
  let investmentTimeline = []
  let priceTimeline = []
  let buyOrderMonths = []
  
  if (portfolioMode && portfolioAssets.length > 0) {
    // Portfolio-Modus
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
    // Standard-Modus
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

  // Debug-Ausgabe im Render
  console.log("Render - Assets:", assets?.length, "Aktuelles Asset:", asset?.symbol)

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCount((prevCount) => prevCount + 1);
  };

  const handleYearsChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setYears(Math.min(Math.max(1, value), maxYears))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Animierte große grüne und blaue Kreise im Hintergrund */}
      <div
        className="pointer-events-none select-none"
        style={{
          position: "fixed",
          zIndex: 0,
          inset: 0,
          opacity: reducedMotion ? 0.3 : 1,
        }}
      >
        {/* Blau */}
        <div
          style={{
            position: "absolute",
            top: `${-80 + Math.sin(circleAnim.t) * 200}px`, // Reduziere Bewegung
            left: `${-80 + Math.cos(circleAnim.t / 2) * 400}px`, // Reduziere Bewegung
            width: "400px",
            height: "400px",
            background: "#2563eb",
            opacity: 0.4, // Reduziere Opacity
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(120px)",
            zIndex: 0,
            transform: "translateZ(0)", // Hardware-Beschleunigung
            willChange: reducedMotion ? "auto" : "transform", // Conditional will-change
            backfaceVisibility: "hidden", // Optimierung
          }}
        />
        
        {/* Grün unten rechts */}
        <div
          style={{
            position: "absolute",
            bottom: `${-60 + Math.cos(circleAnim.t / 1.5) * 200}px`, // Reduziere Bewegung
            right: `${-60 + Math.sin(circleAnim.t / 1.2) * 400}px`, // Reduziere Bewegung
            width: "600px",
            height: "600px",
            background: "#059669",
            opacity: 0.4, // Reduziere Opacity
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(98px)",
            zIndex: 0,
            transform: "translateZ(0)", // Hardware-Beschleunigung
            willChange: reducedMotion ? "auto" : "transform", // Conditional will-change
            backfaceVisibility: "hidden", // Optimierung
          }}
        />
        
        {/* Grün Mitte rechts */}
        <div
          style={{
            position: "absolute",
            top: `calc(45% + ${Math.sin(circleAnim.t / 1.7) * 200}px)`, // Reduziere Bewegung
            left: `calc(65% + ${Math.cos(circleAnim.t / 1.3) * 300}px)`, // Reduziere Bewegung
            width: "400px",
            height: "400px",
            background: "#34d399",
            opacity: 0.3, // Reduziere Opacity
            borderRadius: "50%",
            border: "12px solid #fff",
            filter: "blur(48px)",
            transform: "translate(-50%, -50%) translateZ(0)", // Hardware-Beschleunigung
            zIndex: 0,
            willChange: reducedMotion ? "auto" : "transform", // Conditional will-change
            backfaceVisibility: "hidden", // Optimierung
          }}
        />
      </div>
      <div className="flex w-full max-w-5xl gap-8 items-start justify-center relative z-10">
        {/* Sidebar */}
        <aside
          className="fixed left-0 top-0 bottom-0 shadow-2xl flex flex-col gap-4 max-w-xs"
          style={{
            margin: "32px",
            minWidth: "260px",
            width: "320px",
            height: "calc(100vh - 64px)",
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
          }}
        >
          <form className="flex flex-col gap-4 p-6 h-full overflow-y-auto">
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Startkapital (optional)</span>
              <input
                type="number"
                className="input w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all rounded-2xl text-center border-0 outline-none"
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
                className="select w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all rounded-2xl text-center border-0 outline-none"
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
                  className="input w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all rounded-2xl text-center border-0 outline-none"
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
                className="input w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all rounded-2xl text-center border-0 outline-none"
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

            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Aktie/ETF</span>
              <select
                className="select w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all rounded-2xl text-center border-0 outline-none"
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

            {/* Erweiterte Einstellungen als separate Felder ÜBER dem Button */}
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

            <div
              onClick={() => setShowAdvancedSettings(true)}
              className="mt-2 w-full py-2 rounded-2xl font-medium text-gray-700 cursor-pointer text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
              }}
            >
              Erweiterte Einstellungen
            </div>
          </form>
        </aside>

        {/* Charts und Ergebnis mittig */}
        <div className="flex-1 flex flex-col items-center ml-[352px]">
          {result && (
            <div className="flex gap-4 w-full">
              {/* Metriken Box - schmaler */}
              <div className="flex flex-col gap-4" style={{ width: "240px" }}>
                {(() => {
                  const metrics = calculateMetrics({
                    startAmount,
                    amount: savingAmount,
                    years,
                    result,
                    isMonthly: savingType === 'monthly',
                    increaseEveryNYears: Number(increaseEveryNYears) || 0,
                    increaseAmount: Number(increaseAmount) || 0,
                    doubleMonths
                  });

                  return (
                    <>
                      <MetricBox
                        label="Asset"
                        value={portfolioMode ? "Portfolio" : `${asset.name}`}
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
                        label="Investiertes Kapital"
                        value={metrics.invested.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        })}
                      />

                      <MetricBox
                        label="Gewinn/Verlust"
                        value={`${metrics.profit.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        })} (${metrics.profitPercentage}%)`}
                        color={metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}
                      />

                      <MetricBox
                        label="Ø Jährliche Rendite"
                        value={`${metrics.avgYearlyReturn}%`}
                        color={metrics.avgYearlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Hauptdiagramm-Bereich - mehr Platz */}
              <div className="flex-1 space-y-4">
                {/* Portfolio Asset-Diagramme (eine Zeile) */}
                {portfolioMode && portfolioAssets.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {portfolioAssets.filter(pa => pa.symbol && pa.allocation > 0).map((portfolioAsset, index) => {
                      const assetData = assets.find(a => a.symbol === portfolioAsset.symbol);
                      if (!assetData) return null;
                      
                      const assetPriceTimeline = calculatePriceTimeline({
                        monthlyReturns: assetData.monthlyReturns?.slice(-months) || [],
                        prices: assetData.monthlyPrices?.slice(-months-1) || []
                      });

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
                          <ResponsiveContainer width="100%" height={180}>
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
                {(result && investmentTimeline.length > 0) && (
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
                    {portfolioMode ? (
                      // Portfolio Investment-Entwicklung
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Portfolio Investment-Entwicklung</h2>
                        <ResponsiveContainer width="100%" height={400}>
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
                            {buyOrderMonths.map(month => (
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
                      // Standard-Diagramme
                      <>
                        <div className="mb-8">
                          <h2 className="text-xl font-semibold mb-2">Kursverlauf</h2>
                          <ResponsiveContainer width="100%" height={250}>
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
                              {buyOrderMonths.map(month => (
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
                        <div>
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
                              {buyOrderMonths.map(month => (
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal außerhalb der Sidebar */}
      {showAdvancedSettings ? (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdvancedSettings(false);
            }
          }}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAdvancedSettings(false);
                  // Reset der Aufklapp-States beim Schließen
                  setShowIncreaseSection(false);
                  setShowDoublePaymentSection(false);
                  setShowPortfolioSection(false);
                }}
                className="p-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
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

              {/* Portfolio/Sparplan - Aufklappbar */}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAdvancedSettings(false);
                  setShowIncreaseSection(false);
                  setShowDoublePaymentSection(false);
                  setShowPortfolioSection(false);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAdvancedSettings(false);
                  setShowIncreaseSection(false);
                  setShowDoublePaymentSection(false);
                  setShowPortfolioSection(false);
                }}
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
      ) : null}

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <span>Lade Asset-Daten...</span>
        </div>
      )}
      {error && (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          Fehler beim Laden der Asset-Daten: {error}
        </div>
      )}
    </div>
  )
}

export default App
