const express = require("express")
const cors = require("cors")
const assetsRouter = require("./assets")

const app = express()

// Erlaube GitHub Pages als Origin
const allowedOrigins = [
  'https://daviddd113.github.io',
  // weitere erlaubte Origins ggf. ergänzen
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) {
      // Erlaube serverseitige oder lokale Tools ohne Origin
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      // Nur die aktuelle Origin zurückgeben, nicht ein Array!
      return callback(null, origin);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.get("/", (req, res) => {
  res.send("API läuft. Benutze /api/assets für Asset-Daten.")
})

app.use("/api/assets", assetsRouter)

// Fehler-Logging Middleware (nach allen Routen)
app.use((err, req, res, next) => {
  console.error("API-Fehler:", err)
  res.status(500).json({ error: err.message || "Interner Serverfehler" })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API läuft auf http://localhost:${PORT}/api/assets`)
})
