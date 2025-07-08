export const calculatePrognoseData = ({
  startAmount = 0,
  savingAmount = 0,
  years = 1,
  rendite = 0,
  dividendenRendite = 0,
  isMonthly = false,
  increaseEveryNYears = 0,
  increaseAmount = 0,
  doubleMonths = []
}) => {
  const data = []
  let currentValue = startAmount
  let currentSavingAmount = savingAmount
  let totalInvested = startAmount
  let totalDividends = 0
  
  for (let year = 1; year <= years; year++) {
    // Erhöhung alle N Jahre - aber erst NACH dem N-ten Jahr
    if (increaseEveryNYears > 0 && year > increaseEveryNYears && (year - 1) % increaseEveryNYears === 0) {
      currentSavingAmount += increaseAmount
    }
    
    // Jährliche Sparrate berechnen
    let yearlyContribution = isMonthly ? currentSavingAmount * 12 : currentSavingAmount
    
    // Doppelte Einzahlungen hinzufügen (nur bei monatlicher Sparrate)
    if (isMonthly && doubleMonths && doubleMonths.length > 0) {
      yearlyContribution += currentSavingAmount * doubleMonths.length
    }
    
    // Neue Einzahlungen zu Jahresbeginn hinzufügen
    currentValue += yearlyContribution
    totalInvested += yearlyContribution
    
    // Dividenden berechnen (auf das gesamte Kapital am Jahresanfang)
    const yearlyDividends = currentValue * dividendenRendite
    totalDividends += yearlyDividends
    
    // Dividenden werden thesauriert (reinvestiert)
    currentValue += yearlyDividends
    
    // Kursrendite auf das gesamte Kapital (inklusive reinvestierte Dividenden)
    currentValue = currentValue * (1 + rendite)
    
    data.push({
      year,
      value: Math.round(currentValue),
      invested: Math.round(totalInvested),
      dividends: Math.round(totalDividends),
      yearlyDividends: Math.round(yearlyDividends)
    })
  }
  
  return data
}

export const calculatePrognoseMetrics = ({
  startAmount = 0,
  savingAmount = 0,
  years = 1,
  rendite = 0,
  dividendenRendite = 0,
  isMonthly = false,
  increaseEveryNYears = 0,
  increaseAmount = 0,
  doubleMonths = []
}) => {
  try {
    const data = calculatePrognoseData({
      startAmount,
      savingAmount,
      years,
      rendite,
      dividendenRendite,
      isMonthly,
      increaseEveryNYears,
      increaseAmount,
      doubleMonths
    })
    
    if (data.length === 0) {
      return {
        finalValue: 0,
        totalInvested: 0,
        totalDividends: 0,
        totalProfit: 0,
        kest: 0,
        netValueAfterKest: 0
      }
    }
    
    const finalData = data[data.length - 1]
    // KESt 27,5% auf Kapitalerträge (Kursgewinne + Dividenden)
    const totalProfitBeforeTax = finalData.value - finalData.invested
    const kest = totalProfitBeforeTax * 0.275
    const netValueAfterKest = finalData.value - kest
    // Gewinn nach neuer Definition:
    const totalProfit = netValueAfterKest - finalData.invested

    return {
      finalValue: finalData.value,
      totalInvested: finalData.invested,
      totalDividends: finalData.dividends,
      totalProfit: totalProfit,
      kest: kest,
      netValueAfterKest: netValueAfterKest
    }
  } catch (error) {
    console.error('Fehler in calculatePrognoseMetrics:', error)
    return {
      finalValue: 0,
      totalInvested: 0,
      totalDividends: 0,
      totalProfit: 0,
      kest: 0,
      netValueAfterKest: 0
    }
  }
}
