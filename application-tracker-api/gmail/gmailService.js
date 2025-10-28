const { google } = require("googleapis");
const supabase = require("../utils/supabaseClient.js");
const { oAuth2Client } = require("./gmailClient.js");
const {
  parseJobDetails,
  isLikelyApplication,
} = require("../utils/parseJobDetails.js");

async function fetchEmails() {
  const accessToken = await oAuth2Client.getAccessToken();
  if (!accessToken) {
    return;
  }
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 50, // Increased to get more emails
    orderBy: "internalDate", // Sort by date
    q: "(in:inbox OR in:sent) newer_than:7d",
  });

  if (!res.data.messages || res.data.messages.length === 0) {
    console.info("No new job-related emails found.");
    return;
  }

  for (let message of res.data.messages) {
    const fullMessage = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });

    const headers = fullMessage.data.payload.headers;
    const subjectHeader = headers.find((h) => h.name === "Subject");
    const subject = subjectHeader ? subjectHeader.value : "";

    // --- decode body (needed for spam filter) ---
    let bodyText = "";
    if (fullMessage.data.payload.body?.data) {
      bodyText = Buffer.from(
        fullMessage.data.payload.body.data,
        "base64"
      ).toString("utf8");
    } else if (fullMessage.data.payload.parts) {
      const textPart = fullMessage.data.payload.parts.find(
        (p) => p.mimeType === "text/plain"
      );
      if (textPart?.body?.data) {
        bodyText = Buffer.from(textPart.body.data, "base64").toString("utf8");
      }
    }

    // --- filter for job-related mails ---
    if (!isLikelyApplication({ subject, bodyText })) {
      console.info("⏭️ Skipping non-application mail:", subject);
      continue;
    }

    // --- parse company + role ---
    const { company, role } = parseJobDetails(subject);

    // --- insert into Supabase ---
    const { error } = await supabase.from("applications").insert([
      {
        company,
        role,
        applied_on: new Date().toISOString(),
        status: "Applied",
        notes: "Added automatically from Gmail",
        gmail_message_id: message.id,
      },
    ]);

    if (error && error.code === "23505") {
      console.info("Duplicate email found, skipping:", message.id);
    } else if (error) {
      console.error("Insert error:", error.message);
    } else {
      console.info("✅ Inserted:", subject);
    }
  }
}

module.exports = { fetchEmails };
