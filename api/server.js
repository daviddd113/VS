const express = require("express")
const cors = require("cors")
const assetsRouter = require("./assets")

const app = express()

// Erlaube GitHub Pages als Origin
const allowedOrigins = [
  'https://daviddd113.github.io',
  'https://turbo-guacamole-6949xg77wp4g35xrw-5173.app.github.dev'
];

app.use(cors({
  origin: function(origin, callback) {
    // Erlaube keine Origin (z.B. bei lokalen Tools) oder explizit erlaubte Origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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
