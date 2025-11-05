const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const { requireAuth } = require("../middleware/auth");

// GET /applications
router.get("/applications", requireAuth, async (req, res) => {
  try {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", req.session.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /addApplication
router.post("/addApplication", requireAuth, async (req, res) => {
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
          gmail_message_id,
          user_id: req.session.user.id,
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

// POST /removeApplication
router.post("/removeApplication", requireAuth, async (req, res) => {
  try {
    // First check if the application belongs to the user
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("id", req.body.id)
      .eq("user_id", req.session.user.id)
      .single();

    if (!existing) {
      return res
        .status(404)
        .json({ error: "Application not found or not authorized" });
    }

    const { data, error } = await supabase
      .from("applications")
      .delete()
      .eq("id", req.body.id)
      .eq("user_id", req.session.user.id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ application: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
