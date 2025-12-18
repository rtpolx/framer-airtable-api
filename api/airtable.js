// airtable.js

export const config = {
    api: {
      bodyParser: true, // Ensure POST requests are parsed as JSON
    },
  };
  
  export default async function handler(req, res) {
    const AIRTABLE_KEY = process.env.AIRTABLE_KEY; // Airtable API key
    const BASE_ID = "appUD9ap1Ei7trZAD";          // Your Airtable Base ID
    const TABLE_NAME = "Test_Data";               // Exact table name
  
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
        case "GET":
          console.log("GET request received");
          // Fetch all records (first page only)
          const getResponse = await fetch(AIRTABLE_URL, { headers });
          const getData = await getResponse.json();
  
          if (getData.error) {
            return res.status(400).json({ error: getData.error });
          }
  
          return res.status(200).json(getData);
  
        case "POST":
          console.log("POST request received");
          const { fields } = req.body;
  
          if (!fields || typeof fields !== "object") {
            return res.status(400).json({ error: "Missing or invalid 'fields' in request body" });
          }
  
          const postResponse = await fetch(AIRTABLE_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({ fields }),
          });
  
          const postData = await postResponse.json();
  
          if (postData.error) {
            return res.status(400).json({ error: postData.error });
          }
  
          return res.status(200).json(postData);
  
        default:
          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).json({ error: `Method ${req.method} not allowed` });
      }
    } catch (err) {
      console.error("Serverless function error:", err);
      return res.status(500).json({ error: "Internal server error", details: err?.message });
    }
  }
  