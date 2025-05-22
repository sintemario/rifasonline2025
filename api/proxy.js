export default async (req, res) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxWj7-50CBqvEM-eT9dwSmQ5HbR7mLdMp6YW6Q5F3ge8izCYBQhv3zQcQ4q99SZW2AQ5Q/exec";
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: req.body
  });
  const data = await response.json();
  res.status(200).json(data);
};
