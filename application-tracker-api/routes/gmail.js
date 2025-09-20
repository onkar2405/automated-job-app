const express = require("express");
const fs = require("fs");
const path = require("path");
const { oAuth2Client } = require("../gmail/gmailClient");

const router = express.Router();
const { google } = require("googleapis");
// function requireLogin(req, res, next) {
//   if (!req.session.user) return res.redirect("/login");
//   next();
// }

// Login page
router.get("/login", (req, res) => {
  res.send('<a href="/auth">Login with Google</a>');
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
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
});

// Step 2: Handle callback from Google
// router.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     console.log("✅ Tokens received:", tokens);

//     // Save refresh_token to .env file if present
//     if (tokens.refresh_token) {
//       const envPath = path.join(__dirname, "../..", ".env");
//       let envFile = fs.existsSync(envPath)
//         ? fs.readFileSync(envPath, "utf8")
//         : "";

//       // Replace old token if exists, otherwise append
//       if (envFile.includes("GOOGLE_REFRESH_TOKEN=")) {
//         envFile = envFile.replace(
//           /GOOGLE_REFRESH_TOKEN=.*/g,
//           `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
//         );
//       } else {
//         envFile += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
//       }

//       fs.writeFileSync(envPath, envFile);
//       console.log("🔑 Refresh Token saved to .env");
//     }

//     res.send(
//       "Authorization successful! Refresh token saved. You can close this tab."
//     );
//   } catch (err) {
//     console.error("❌ Error during callback:", err);
//     res.status(500).send("Auth error");
//   }
// });

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get the user's Google profile (email, name, picture)
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    const { data: profile } = await oauth2.userinfo.get();

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

// // Home (protected)
// router.get("/home", requireLogin, (req, res) => {
//   res.send(`Welcome ${req.session.user.email}!`);
// });

module.exports = router;
