const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const path      = require("path");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// ✅ CORS fix — Netlify URL allow karo
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://edu-school1.netlify.app",
    "*"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "EduSchool API Running ✅" });
});

// Routes
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/students",   require("./routes/students"));
app.use("/api/teachers",   require("./routes/teachers"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/results",    require("./routes/results"));
app.use("/api/fees",       require("./routes/fees"));
app.use("/api/notices",    require("./routes/notices"));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));