const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Load credentials.json (downloaded from Google Cloud Console)
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // e.g. http://localhost:5000/oauth2callback
);

// // 👇 Attach refresh token if available (from .env)
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    access_token: process.env.ACCESS_TOKEN,
  });

  // Force refresh to ensure access_token is valid
  oAuth2Client
    .getAccessToken()
    .then((token) => console.log("✅ Access token refreshed"))
    .catch((err) => console.error("❌ Failed to refresh access token:", err));
}

module.exports = { oAuth2Client };
