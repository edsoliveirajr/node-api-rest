const express = require("express");

const app = express();
var contReq = 0;

app.use(express.json());

const projects = [
  {
    id: "1",
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
];

app.use((req, res, next) => {
  contReq++;
  console.log(`Qtd de requisições: ${contReq}`);

  next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  if (id !== undefined && !projects.find(x => x.id == id)) {
    return res.status(400).json({ error: `Não existe projeto com o ID ${id}` });
  }

  next();
}

function GetIndexById(projects, id) {
  const project = projects.find(x => x.id == id);
  return projects.indexOf(project);
}

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.get("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(x => x.id == id);

  return res.json(project);
});

app.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  let index = GetIndexById(projects, id);

  projects.splice(index, 1);

  return res.json(projects);
});

app.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title, tasks } = req.body;

  const project = projects.find(x => x.id == id);
  let index = projects.indexOf(project);

  projects[index] = { ...project, title, tasks };

  return res.json(projects);
});

app.post("/projects", (req, res) => {
  let project = req.body;

  projects.push(project);

  return res.json(projects);
});

app.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  let { id } = req.params;
  let { title } = req.body;

  let index = GetIndexById(projects, id);

  projects[index].tasks.push(title);

  return res.json(projects[index]);
});

app.listen("3000");
