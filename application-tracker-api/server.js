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
const supabase = require("./utils/supabaseClient");
const { fetchEmails } = require("./gmail/gmailService");

// No auth required here:

app.use(
  cors({
    origin: "http://localhost:3000", // your React app's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.get("/applications", async (req, res) => {
  const { data } = await supabase.from("applications").select("*");
  res.json(data);
});

app.post("/addApplication", async (req, res) => {
  const { company, role, status, appliedOn, gmail_message_id } = req.body;

  try {
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          company,
          role,
          status,
          applied_on: appliedOn,
          notes: "just applied",
          gmail_message_id, // 🔑 unique Gmail ID
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (error && error.code === "23505") {
      console.log("Duplicate email, skipping insert.");
    }

    res.json({ application: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/removeApplication", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .delete()
      .eq("id", req.body.id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ application: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
