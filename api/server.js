const express = require("express")
const cors = require("cors")
const assetsRouter = require("./assets")

const app = express()
app.use(cors({
  origin: "https://turbo-guacamole-6949xg77wp4g35xrw-5173.app.github.dev",
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  credentials: true
}))

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
