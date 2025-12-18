import fetch from "node-fetch";

export default async function handler(req, res) {
  const AIRTABLE_KEY = process.env.AIRTABLE_KEY;
  const BASE_ID = "appUD9ap1Ei7trZAD";       // Replace with your Airtable Base ID
  const TABLE_NAME = "Test_Data"; // Replace with your Table Name

  if (req.method === "GET") {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }

  if (req.method === "POST") {
    try {
      const { fields } = req.body;
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields }),
        }
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to send data" });
    }
  }
}
