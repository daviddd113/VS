import React from 'react'
import { monthNames } from '../utils/helpers'

function PrognoseSidebar({
  startAmount,
  setStartAmount,
  savingType,
  setSavingType,
  savingAmount,
  setSavingAmount,
  years,
  setYears,
  rendite,
  setRendite,
  dividendenRendite,
  setDividendenRendite,
  increaseEveryNYears,
  setIncreaseEveryNYears,
  increaseAmount,
  setIncreaseAmount,
  doubleMonths,
  setDoubleMonths,
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
    setYears(Math.min(Math.max(1, value), 50))
  }

  const handleRenditeChange = (e) => {
    const value = Number(e.target.value) || 0
    setRendite(Math.min(Math.max(-50, value), 50))
  }

  const handleDividendenRenditeChange = (e) => {
    const value = Number(e.target.value) || 0
    setDividendenRendite(Math.min(Math.max(0, value), 20))
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
            <h2 className="text-xl font-bold text-gray-800">Prognose</h2>
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
              max={50}
              placeholder="z.B. 20"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">Durchschn. Rendite (% p.a.)</span>
            <input
              type="number"
              step="0.1"
              className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              value={rendite}
              onChange={handleRenditeChange}
              min={-50}
              max={50}
              placeholder="z.B. 7.5"
            />
            <span className="text-xs text-gray-500 text-center">
              Erwartete jährliche Kursrendite in Prozent
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">Dividendenrendite (% p.a.)</span>
            <input
              type="number"
              step="0.1"
              className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              value={dividendenRendite}
              onChange={handleDividendenRenditeChange}
              min={0}
              max={20}
              placeholder="z.B. 2.5"
            />
            <span className="text-xs text-gray-500 text-center">
              Jährliche Dividendenrendite (thesaurierend)
            </span>
          </label>

          {/* Erweiterte Einstellungen anzeigen */}
          {(increaseEveryNYears > 0 || increaseAmount > 0) && (
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Automatische Erhöhung</span>
              <input
                type="text"
                className="input w-full transition-all rounded-2xl text-center border-0 outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
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


export default PrognoseSidebar
