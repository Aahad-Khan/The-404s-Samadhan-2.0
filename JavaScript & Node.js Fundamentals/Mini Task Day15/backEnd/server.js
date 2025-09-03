const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());                 // frontend http://localhost:5173
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("Mongo error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
