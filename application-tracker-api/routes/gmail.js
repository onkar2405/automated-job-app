const express = require("express");
const fs = require("fs");
const path = require("path");
const { oAuth2Client } = require("../gmail/gmailClient");

const router = express.Router();
const { google } = require("googleapis");

// Login page
router.get("/login", (req, res) => {
  res.redirect("/auth");
});

// Root
router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  }
  res.redirect("login");
});

// Step 1: Start OAuth flow
router.get("/auth", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline", // ensures refresh_token is returned
    prompt: "consent", // ensures Google always sends refresh_token first time
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens to .env file
    const envPath = path.join(__dirname, "../.env");
    let envContent = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, "utf8") + "\n"
      : "";

    // Update or append tokens
    if (tokens.refresh_token) {
      envContent = envContent.replace(/GOOGLE_REFRESH_TOKEN=.*/g, "");
      envContent += `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
    }
    if (tokens.access_token) {
      envContent = envContent.replace(/ACCESS_TOKEN=.*/g, "");
      envContent += `ACCESS_TOKEN=${tokens.access_token}\n`;
    }

    fs.writeFileSync(envPath, envContent);

    // Also set in current process
    process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
    process.env.ACCESS_TOKEN = tokens.access_token;

    // Get the user's Google profile (email, name, picture)
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    console.log("oauth2 onkar");

    const { data: profile } = await oauth2.userinfo.get();
    console.log("profile", profile);
    // ✅ Store real user details in session
    req.session.user = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    };

    console.log("✅ Logged in user:", req.session.user);

    res.redirect("http://localhost:3000");
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(500).send("Auth error");
  }
});

module.exports = router;
