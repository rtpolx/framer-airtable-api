export const config = {
    api: {
      bodyParser: true,
    },
  };
  
  export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // Respond to preflight
    }
  
    const AIRTABLE_KEY = process.env.AIRTABLE_KEY;
    const BASE_ID = "appUD9ap1Ei7trZAD";
    const TABLE_NAME = "Test_Data";
  
    if (!AIRTABLE_KEY) {
      return res.status(500).json({ error: "Missing AIRTABLE_KEY environment variable" });
    }
  
    const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
    const headers = {
      Authorization: `Bearer ${AIRTABLE_KEY}`,
      "Content-Type": "application/json",
    };
  
    try {
      switch (req.method) {
        case "GET": {
          const response = await fetch(AIRTABLE_URL, { headers });
          const data = await response.json();
          if (data.error) return res.status(400).json({ error: data.error });
          return res.status(200).json(data);
        }
  
        case "POST": {
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
          if (data.error) return res.status(400).json({ error: data.error });
          return res.status(200).json(data);
        }
  
        default:
          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).json({ error: `Method ${req.method} not allowed` });
      }
    } catch (err) {
      console.error("Serverless function error:", err);
      return res.status(500).json({ error: "Internal server error", details: err?.message });
    }
  }
  