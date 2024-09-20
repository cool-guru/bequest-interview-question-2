import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
const SECRET_KEY = "SuperSecretKey123!@#RandomValue0987";

const database = { data: "Hello World", hash: "" };

function generateHMAC(data: string) {
  return crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
}

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  database.hash = generateHMAC(database.data); // Always generate the hash on the server
  res.json(database);
});

app.post("/", (req, res) => {
  const { data, hash } = req.body;

  // Validate hash from client against server-side hash
  const serverHash = generateHMAC(data);
  if (serverHash === hash) {
    // Only update if the hash matches what we expect
    database.data = data;
    database.hash = serverHash; // Store the hash server-side
    res.status(200).send("Data updated successfully");
  } else {
    res.status(400).send("Hash mismatch - potential tampering detected");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
