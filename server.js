

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");

dotenv.config();

// ✅ Database Connection
const connectDB = require("./config/db");
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Static Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Health Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎓 EduSchool API Running Successfully",
  });
});

// ===============================
// ✅ Routes
// ===============================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/results", require("./routes/results"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api/notices", require("./routes/notices"));

// ===============================
// ❌ 404 Route Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ===============================
// ❌ Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 Server Running Successfully
🌍 Port: ${PORT}
📦 Mode: ${process.env.NODE_ENV}
  `);
});