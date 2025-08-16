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

// app.post("/applications", async (req, res) => {
//   const { company, role, status, date } = req.body;
//   const {data} = await supabase.from("applications").insert(req.)
//   res.json(newApp);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
