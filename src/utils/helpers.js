export function getDateFromMonth(month, totalMonths) {
  const date = new Date()
  date.setMonth(date.getMonth() - totalMonths)
  date.setMonth(date.getMonth() + month)
  return date.toLocaleDateString('de-DE', { 
    month: 'long',
    year: 'numeric'
  })
}

export function yearTickFormatter(month) {
  if (month % 12 === 0) {
    return `Jahr ${month / 12 + 1}`
  }
  return ""
}

export function dollarFormatter(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })
}

export function calculateCapitalGainsTax(profit, taxRate = 0.275) {
  if (profit <= 0) return 0;
  return profit * taxRate;
}

export const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];
