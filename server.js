import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      scope: "https://graph.microsoft.com/.default",
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  const data = await response.json();
  return data.access_token;
}

app.post("/api/meetings", async (req, res) => {
  try {
    const { subject, startDateTime, endDateTime, attendees } = req.body;

    const token = await getAccessToken();
    const client = Client.init({
      authProvider: (done) => done(null, token),
    });

    const meeting = {
      subject,
      startDateTime,
      endDateTime,
      participants: {
        attendees: attendees.map((email) => ({ upn: email })),
      },
    };

    const response = await client.api("/me/onlineMeetings").post(meeting);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`✅ Backend running on http://localhost:${process.env.PORT}`)
);
