const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const sessions = require("express-session");
const cron = require("node-cron");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Import routes and services
const gmailRoutes = require("./routes/gmail");
const authRoutes = require("./routes/authRoutes");
const { fetchEmails } = require("./gmail/gmailService");

// No auth required here:

app.use(
  cors({
    origin: "http://localhost:3000", // your React app's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());

// Sessions
app.use(
  sessions({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only with https
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
const applicationsRoutes = require("./routes/applications");
app.use("/", applicationsRoutes);

// Mount routes
app.use("/", gmailRoutes);
app.use("/auth", authRoutes);

// Run Gmail fetch every 10 minutes

cron.schedule("*/10 * * * *", () => {
  console.log("⏳ Checking Gmail...");
  fetchEmails();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
