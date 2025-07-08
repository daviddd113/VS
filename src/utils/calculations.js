import { calculateCapitalGainsTax } from './helpers'

export function calculateInvestmentWithMonthlyReturns({ 
  startAmount, 
  amount, 
  monthlyReturns, 
  isMonthly,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths 
}) {
  if (!monthlyReturns || monthlyReturns.length === 0) {
    return startAmount || 0
  }

  let total = Number(startAmount) || 0
  let baseAmount = Number(amount) || 0
  
  for (let i = 0; i < monthlyReturns.length; i++) {
    const currentMonth = i % 12
    
    if (increaseEveryNYears && increaseAmount && i > 0 && i % (increaseEveryNYears * 12) === 0) {
      baseAmount += Number(increaseAmount)
    }
    
    let currentAmount = baseAmount
    
    if (doubleMonths?.includes(currentMonth + 1)) {
      currentAmount *= 2
    }
    
    const contribution = isMonthly ? currentAmount : (i % 12 === 0 ? currentAmount : 0)
    const monthlyReturn = monthlyReturns[i] || 0
    total = total * (1 + monthlyReturn) + contribution
  }
  
  return Math.max(total, 0)
}

export function calculatePriceTimeline({ monthlyReturns, prices }) {
  if (!prices || prices.length === 0) {
    return []
  }

  return prices.map((price, i) => ({
    month: i,
    price: price || 0,
    startPrice: prices[0] || 0,
    totalMonths: prices.length - 1
  }));
}

export function calculateInvestmentTimeline({ 
  startAmount, 
  amount, 
  monthlyReturns, 
  isMonthly,
  increaseEveryNYears,
  increaseAmount,
  doubleMonths 
}) {
  if (!monthlyReturns || monthlyReturns.length === 0) {
    return [{ month: 0, value: Number(startAmount) || 0, totalMonths: 0 }]
  }

  const timeline = []
  let total = Number(startAmount) || 0
  let baseAmount = Number(amount) || 0
  
  timeline.push({ 
    month: 0, 
    value: total,
    totalMonths: monthlyReturns.length 
  })
  
  for (let i = 0; i < monthlyReturns.length; i++) {
    if (increaseEveryNYears && increaseAmount && i > 0 && i % (increaseEveryNYears * 12) === 0) {
      baseAmount += Number(increaseAmount)
    }
    
    let currentAmount = baseAmount
    if (doubleMonths?.includes((i % 12) + 1)) {
      currentAmount *= 2
    }
    
    const contribution = isMonthly ? currentAmount : (i % 12 === 0 ? currentAmount : 0)
    const monthlyReturn = monthlyReturns[i] || 0
    total = total * (1 + monthlyReturn) + contribution
    
    timeline.push({ 
      month: i + 1, 
      value: Math.max(total, 0),
      totalMonths: monthlyReturns.length 
    })
  }
  
  return timeline
}

export function calculateMetrics({ startAmount, amount, years, result, isMonthly, increaseEveryNYears, increaseAmount, doubleMonths }) {
  try {
    let totalContributions = 0;
    let currentAmount = Number(amount) || 0;
    const numYears = Number(years) || 1;
    const finalResult = Number(result) || 0;
    
    for (let year = 0; year < numYears; year++) {
      if (increaseEveryNYears && increaseAmount && year > 0 && year % increaseEveryNYears === 0) {
        currentAmount += Number(increaseAmount);
      }
      
      if (isMonthly) {
        for (let month = 1; month <= 12; month++) {
          let monthlyContribution = currentAmount;
          if (doubleMonths?.includes(month)) {
            monthlyContribution *= 2;
          }
          totalContributions += monthlyContribution;
        }
      } else {
        totalContributions += currentAmount;
      }
    }
    
    const invested = Number(startAmount || 0) + totalContributions;
    const profitBeforeTax = finalResult - invested;
    const capitalGainsTax = calculateCapitalGainsTax(profitBeforeTax);
    const resultAfterTax = finalResult - capitalGainsTax;
    // Gewinn nach neuer Definition:
    const profit = resultAfterTax - invested;
    const profitPercentage = invested > 0 ? ((finalResult / invested - 1) * 100).toFixed(1) : "0.0";
    const avgYearlyReturn = invested > 0 && numYears > 0 ? ((Math.pow(finalResult / invested, 1 / numYears) - 1) * 100).toFixed(1) : "0.0";
    
    return {
      invested: Math.max(invested, 0),
      profit,
      profitPercentage,
      avgYearlyReturn,
      capitalGainsTax: Math.max(capitalGainsTax, 0),
      resultAfterTax: Math.max(resultAfterTax, 0)
    };
  } catch (error) {
    console.error('Error in calculateMetrics:', error);
    return {
      invested: Number(startAmount) || 0,
      profit: 0,
      profitPercentage: "0.0",
      avgYearlyReturn: "0.0",
      capitalGainsTax: 0,
      resultAfterTax: Number(result) || 0
    };
  }
}

export function calculatePortfolioReturns(portfolioAssets, assets, months) {
  if (!portfolioAssets || portfolioAssets.length === 0) return []
  
  const validAssets = portfolioAssets.filter(pa => {
    const assetData = assets.find(a => a.symbol === pa.symbol)
    return assetData && pa.allocation > 0
  })
  
  if (validAssets.length === 0) return []
  
  const totalAllocation = validAssets.reduce((sum, pa) => sum + pa.allocation, 0)
  if (totalAllocation === 0) return []
  
  let maxAvailableMonths = months
  validAssets.forEach(pa => {
    const assetData = assets.find(a => a.symbol === pa.symbol)
    if (assetData && assetData.monthlyReturns) {
      maxAvailableMonths = Math.min(maxAvailableMonths, assetData.monthlyReturns.length)
    }
  })
  
  const portfolioReturns = []
  
  for (let month = 0; month < maxAvailableMonths; month++) {
    let weightedReturn = 0
    
    validAssets.forEach(pa => {
      const assetData = assets.find(a => a.symbol === pa.symbol)
      if (assetData && assetData.monthlyReturns && assetData.monthlyReturns[assetData.monthlyReturns.length - maxAvailableMonths + month] !== undefined) {
        const monthlyReturn = assetData.monthlyReturns[assetData.monthlyReturns.length - maxAvailableMonths + month]
        const weight = pa.allocation / totalAllocation
        weightedReturn += monthlyReturn * weight
      }
    })
    
    portfolioReturns.push(weightedReturn)
  }
  
  return portfolioReturns
}

