import fetch from "node-fetch";

// Ensure Vercel parses JSON body
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  const AIRTABLE_KEY = process.env.AIRTABLE_KEY;
  const BASE_ID = "appUD9ap1Ei7trZAD";       // Replace with your Base ID
  const TABLE_NAME = "Test_Data";             // Use exact table name (check Airtable API docs)

  const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  const headers = {
    Authorization: `Bearer ${AIRTABLE_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    if (req.method === "GET") {
      const response = await fetch(AIRTABLE_URL, { headers });
      const data = await response.json();

      // If Airtable returns an error, forward it
      if (data.error) {
        return res.status(400).json({ error: data.error });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { fields } = req.body;

      if (!fields || typeof fields !== "object") {
        return res.status(400).json({ error: "Missing or invalid 'fields' in request body" });
      }

      const response = await fetch(AIRTABLE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ fields }),
      });

      const data = await response.json();

      if (data.error) {
        return res.status(400).json({ error: data.error });
      }

      return res.status(200).json(data);
    }

    // If method is not GET or POST
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error("Airtable request failed:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
