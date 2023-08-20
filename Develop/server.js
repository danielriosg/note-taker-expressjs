const express = require("express");
const fs = require("fs");
const uuid = require("./helper/uuid");
const app = express();
const PORT = process.env.PORT || 3000; // Use the desired port number



app.get("/notes", (req, res) => {
  res.sendFile(__dirname + "/public/notes.html");
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Read and Return All Saved Notes (GET /api/notes?
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/Develop/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

