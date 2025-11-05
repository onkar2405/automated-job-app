// gmailClient.js
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Load credentials.json (downloaded from Google Cloud Console)
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

const { client_id, client_secret, redirect_uris } = credentials.web;

// Create a fresh OAuth client for each user
function createOAuthClient() {
  return new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] // http://localhost:5000/oauth2callback
  );
}

module.exports = { createOAuthClient };
