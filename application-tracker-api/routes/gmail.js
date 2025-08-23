const express = require("express");
const fs = require("fs");
const path = require("path");
const { oAuth2Client } = require("../gmail/gmailClient");

const router = express.Router();

// Step 1: Start OAuth flow
router.get("/auth", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline", // ensures refresh_token is returned
    prompt: "consent", // ensures Google always sends refresh_token first time
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
});

// Step 2: Handle callback from Google
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    console.log("✅ Tokens received:", tokens);

    // Save refresh_token to .env file if present
    if (tokens.refresh_token) {
      const envPath = path.join(__dirname, "../..", ".env");
      let envFile = fs.existsSync(envPath)
        ? fs.readFileSync(envPath, "utf8")
        : "";

      // Replace old token if exists, otherwise append
      if (envFile.includes("GOOGLE_REFRESH_TOKEN=")) {
        envFile = envFile.replace(
          /GOOGLE_REFRESH_TOKEN=.*/g,
          `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
      } else {
        envFile += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
      }

      fs.writeFileSync(envPath, envFile);
      console.log("🔑 Refresh Token saved to .env");
    }

    res.send(
      "Authorization successful! Refresh token saved. You can close this tab."
    );
  } catch (err) {
    console.error("❌ Error during callback:", err);
    res.status(500).send("Auth error");
  }
});

module.exports = router;
