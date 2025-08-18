const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// No auth required here:

app.use(cors());
app.use(express.json());

// Routes
app.get("/applications", async (req, res) => {
  const { data } = await supabase.from("applications").select("*");
  res.json(data);
});

app.post("/addApplication", async (req, res) => {
  const { company, role, status, appliedOn } = req.body;

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
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
