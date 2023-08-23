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
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  next();
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(), // Generate a unique ID using uuid
    };

    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error reading notes" });
      }

      let notes = [];

      try {
        notes = JSON.parse(data);
      } catch (parseError) {
        console.error(parseError);
        return res.status(500).json({ error: "Error parsing existing notes" });
      }

      notes.push(newNote);

      fs.writeFile(
        __dirname + "/db/db.json",
        JSON.stringify(notes),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).json({ error: "Error writing notes" });
          }

          res.status(201).json(newNote);
        }
      );
    });
  } else {
    res.status(400).json({ error: "Missing title or text" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
