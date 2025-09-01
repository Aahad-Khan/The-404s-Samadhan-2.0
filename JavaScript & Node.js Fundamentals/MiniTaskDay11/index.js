const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("error:", err));

// Routes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the CRUD API");
});

// Start server
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
