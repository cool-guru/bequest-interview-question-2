import express from "express";
import cors from "cors";
import crypto from "crypto-js";

const PORT = 8080;
const app = express();
const database = { data: "Hello World", hash: "" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const { data, hash } = req.body;
  const computedHash = crypto.SHA256(data).toString();

  if (hash === computedHash) {
    database.data = data;
    database.hash = hash; // Store the hash in the database
    res.sendStatus(200);
  } else {
    res.status(400).send("Data integrity check failed.");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
