// airtable.js

// For Node 18+, fetch is globally available. Uncomment the next line if using older Node versions
// import fetch from "node-fetch";

// Ensure Vercel parses JSON body
export const config = {
    api: {
      bodyParser: true,
    },
  };
  
  export default async function handler(req, res) {
    const AIRTABLE_KEY = process.env.AIRTABLE_KEY;   // Your Airtable API key
    const BASE_ID = "appUD9ap1Ei7trZAD";             // Your Airtable Base ID
    const TABLE_NAME = "Test_Data";                  // Exact table name (check Airtable API docs)
  
    // Airtable URL with proper encoding for table name
    const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
  
    const headers = {
      Authorization: `Bearer ${AIRTABLE_KEY}`,
      "Content-Type": "application/json",
    };
  
    try {
      if (req.method === "GET") {
        // Fetch records from Airtable
        const response = await fetch(AIRTABLE_URL, { headers });
        const data = await response.json();
  
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
  
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (err) {
      console.error("Serverless function error:", err);
      return res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
  