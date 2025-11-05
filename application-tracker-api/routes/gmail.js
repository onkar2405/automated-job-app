const express = require("express");
const { google } = require("googleapis");
const supabase = require("../utils/supabaseClient");
const { createOAuthClient } = require("../gmail/gmailClient");

const router = express.Router();

router.get("/auth", (req, res) => {
  const oAuth2Client = createOAuthClient();
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const oAuth2Client = createOAuthClient();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    // --- Persist user details and tokens ---
    let { data: currentUser } = await supabase
      .from("users")
      .select("*")
      .eq("google_id", profile.id)
      .single();

    if (currentUser) {
      await supabase
        .from("users")
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || currentUser.refresh_token,
          token_expiry: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);
    } else {
      await supabase.from("users").insert([
        {
          google_id: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : null,
        },
      ]);
    }

    currentUser = await supabase
      .from("users")
      .select("*")
      .eq("google_id", profile.id)
      .single();

    console.log("currentUser:", currentUser);
    req.session.user = {
      google_id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      id: currentUser.data.id,
    };

    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save session" });
      }
      res.redirect("http://localhost:3000");
    });
  } catch (err) {
    console.error("❌ OAuth error:", err);
    res.status(500).send("Auth error");
  }
});

module.exports = router;
