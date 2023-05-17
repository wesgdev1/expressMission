const express = require("express");
const app = express();

let notes = [
  {
    id: "1",
    content: "HTML is easy",
  },
  {
    id: "2",
    content: "Browser can execute only Javascript",
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
  },
];

//SE AGREGO ESTO PARA SOLUCIONAR EL FALLO
app.use(express.json());

//1. Get all
app.get("/notes", (req, res) => {
  res.json(notes);
});

//2. Get one (by id)
app.get("/notes/:id", (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;
  const note = notes.find(function (element) {
    return id === element.id;
  });

  if (note) {
    res.json(note);
  } else {
    next({
      statusCode: 404,
      message: `Note with ${id}, Not Found`,
    });
  }
});

//3. Post (Se envía el body) //NO ME FUNCIONA
app.post("/notes", (req, res) => {
  const { body } = req;
  notes.push(body);
  res.status(201).json(body);
});

//------------------------------------------------------

//4. Put (Se envía el body)
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const note = notes.find((note) => note.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.content = content;
  res.json(note);
});

//-_______________________________________

//5. Delete
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(index, 1);
  res.sendStatus(204);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.use((req, res, next) => {
  next({
    statusCode: 404,
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Error" } = err;
  console.log(message);
  res.status(statusCode);
  res.json({
    message,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
