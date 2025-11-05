const { google } = require("googleapis");
const supabase = require("../utils/supabaseClient");
const { createOAuthClient } = require("./gmailClient");
const {
  parseJobDetails,
  isLikelyApplication,
} = require("../utils/parseJobDetails");

async function fetchEmailsForUser(user) {
  const oAuth2Client = createOAuthClient();
  oAuth2Client.setCredentials({
    refresh_token: user.refresh_token,
    access_token: user.access_token,
  });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 25,
    q: "(in:inbox OR in:sent) newer_than:7d",
  });

  if (!res.data.messages) return;

  for (const msg of res.data.messages) {
    const full = await gmail.users.messages.get({ userId: "me", id: msg.id });
    const headers = full.data.payload.headers;
    const subject = headers.find((h) => h.name === "Subject")?.value || "";

    let bodyText = "";
    if (full.data.payload.body?.data) {
      bodyText = Buffer.from(full.data.payload.body.data, "base64").toString(
        "utf8"
      );
    }

    if (!isLikelyApplication({ subject, bodyText })) continue;

    const { company, role } = parseJobDetails(subject);
    const { error } = await supabase.from("applications").insert([
      {
        user_id: user.id,
        company,
        role,
        status: "Applied",
        applied_on: new Date().toISOString(),
        notes: "Added automatically from Gmail",
        gmail_message_id: msg.id,
      },
    ]);

    if (error && error.code === "23505") continue;
  }
}

// TODO: See if we can batch process emails for all users
async function fetchEmailsForAllUsers() {
  const { data: users } = await supabase.from("users").select("*");
  if (!users) return;

  for (const user of users) {
    console.log(`📧 Fetching emails for ${user.email}`);
    await fetchEmailsForUser(user);
  }
}

module.exports = { fetchEmails: fetchEmailsForAllUsers };
