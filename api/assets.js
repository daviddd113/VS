const express = require("express")
const router = express.Router()
const yahooFinance = require("yahoo-finance2").default

const assetSymbols = [
  // Neue ETFs ganz oben
  { name: "iShares Core MSCI World UCITS ETF", symbol: "IE00BJ0KDQ92", yahoo: "IWDA.L" },
  { name: "Vanguard FTSE All-World UCITS ETF", symbol: "IE00BTJRMP35", yahoo: "VWRL.L" },
  { name: "iShares Core S&P 500 UCITS ETF", symbol: "IE00BF4RFH31", yahoo: "CSSPX.L" },
  
  // Bestehende Assets
  { name: "S&P 500 ETF", symbol: "SPY", yahoo: "SPY" },
  { name: "Vanguard S&P 500", symbol: "VOO", yahoo: "VOO" },
  { name: "Apple Inc.", symbol: "AAPL", yahoo: "AAPL" },
  { name: "Microsoft Corp.", symbol: "MSFT", yahoo: "MSFT" },
  { name: "Amazon.com", symbol: "AMZN", yahoo: "AMZN" },
  { name: "Alphabet Inc.", symbol: "GOOGL", yahoo: "GOOGL" },
  
  // Neue ETFs
  { name: "iShares MSCI World ETF", symbol: "IWDA", yahoo: "IWDA.L" },
  { name: "Vanguard FTSE All-World", symbol: "VWRL", yahoo: "VWRL.L" },
  { name: "Xtrackers MSCI World ETF", symbol: "XMWO", yahoo: "XMWO.MI" },
  { name: "Xtrackers MSCI EM ETF", symbol: "XMEM", yahoo: "XMEM.SW" },
  { name: "iShares MSCI World Small Cap", symbol: "IUSN", yahoo: "IUSN.DE" },
  { name: "MSCI World ETF (US)", symbol: "URTH", yahoo: "URTH" },
  { name: "Emerging Markets ETF", symbol: "EEM", yahoo: "EEM" },
  { name: "Small Cap World ETF", symbol: "VSS", yahoo: "VSS" },
  { name: "Nasdaq 100 ETF", symbol: "QQQ", yahoo: "QQQ" },
  { name: "Europe Stoxx 600 ETF", symbol: "VGK", yahoo: "VGK" },
  { name: "FTSE Developed Europe", symbol: "VEA", yahoo: "VEA" },
  { name: "Total Stock Market ETF", symbol: "VTI", yahoo: "VTI" },
  { name: "Russell 2000 Small Cap", symbol: "IWM", yahoo: "IWM" },
  { name: "Tesla Inc.", symbol: "TSLA", yahoo: "TSLA" },
  { name: "NVIDIA Corp.", symbol: "NVDA", yahoo: "NVDA" }
]

// CORS Middleware erweitern
router.use((req, res, next) => {
  const allowedOrigins = [
    'https://turbo-guacamole-6949xg77wp4g35xrw-5173.app.github.dev',
    'https://turbo-guacamole-6949xg77wp4g35xrw-4000.app.github.dev'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

router.get("/", async (req, res) => {
  try {
    const end = new Date()
    const start = new Date('1927-01-01')

    console.log("Fetching data from", start.toISOString(), "to", end.toISOString())

    const results = []
    
    for (const asset of assetSymbols) {
      try {
        // 1. Hole historische Daten von Yahoo Finance
        const history = await yahooFinance.historical(asset.yahoo, {
          period1: start,
          period2: end,
          interval: "1mo"
        })

        // 2. Sortiere nach Datum (älteste zuerst)
        history.sort((a, b) => new Date(a.date) - new Date(b.date))
        
        // 3. Extrahiere die adjustierten Schlusskurse
        const monthlyPrices = history.map(h => h.adjClose)
        
        // 4. Berechne monatliche Renditen
        const monthlyReturns = []
        for (let i = 1; i < monthlyPrices.length; i++) {
          // Rendite = (Neuer Preis - Alter Preis) / Alter Preis
          const returnRate = (monthlyPrices[i] - monthlyPrices[i-1]) / monthlyPrices[i-1]
          monthlyReturns.push(returnRate)
        }
        
        results.push({
          name: asset.name,
          symbol: asset.symbol,
          currentPrice: monthlyPrices[monthlyPrices.length - 1],
          monthlyReturns,
          monthlyPrices
        })
        
        console.log(`Got ${monthlyReturns.length} monthly returns for ${asset.yahoo}`)
      } catch (err) {
        console.error(`Fehler beim Abrufen von ${asset.yahoo}: ${err.message}`)
        // Fahre mit dem nächsten Asset fort
        continue
      }
    }

    if (results.length === 0) {
      throw new Error('Keine Asset-Daten konnten erfolgreich abgerufen werden')
    }

    console.log(`Sending ${results.length} valid results`)
    res.json(results)

  } catch (err) {
    console.error('Fatal error:', err)
    res.status(500).json({
      error: 'Fehler beim Abrufen der Daten',
      message: err.message
    })
  }
})

module.exports = router