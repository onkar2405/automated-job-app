const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// No auth required here:

app.use(cors());
app.use(express.json());

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

// Run Gmail fetch every 10 minutes

const cron = require("node-cron");
const gmailRoutes = require("./routes/gmail");
const { fetchEmails } = require("./gmail/gmailService");
const supabase = require("./utils/supabaseClient");

app.use("/", gmailRoutes);

cron.schedule("*/10 * * * *", () => {
  console.log("⏳ Checking Gmail...");
  fetchEmails();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
