const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection (this is important!)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yrf9x.mongodb.net/mindflipmania?retryWrites=true&w=majority`

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Mongoose connected to MongoDB")

  // Routes (place inside .then to ensure DB is connected before routes run)
  app.use("/api/auth", require("./routes/auth"))
  app.use("/api/points", require("./routes/points"))
  app.use("/api/themes", require("./routes/themes"))

  app.get("/", (req, res) => {
    res.send("Theme park is running")
  })

  app.listen(port, () => {
    console.log(`🚀 Theme Park is running on port ${port}`)
  })
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err)
})
