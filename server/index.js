const express = require("express");

const app = express();
const path = "../data/tasks.json";
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(5000);

app.get("/Task", (req, res) => {
  var tasksList = require(path);
  const taskupdate = tasksList.filter((x) => x.started == 1);
  if (taskupdate.length > 0) {
    taskupdate
      .filter((x) => x.completed != 1)
      .forEach((item, i) => {
        if (item.completed == 0) {
          const index = tasksList.findIndex((x) => x.id == item.id);
          const task = tasksList[index];
          let today = new Date();
          const expectedEndDate = new Date(task.expectedEndDate);

          const fechaInicio = new Date(today.toUTCString());
          const fechaFin = new Date(expectedEndDate.toUTCString());
          const diff = fechaFin - fechaInicio;
          const minDif = diff;
          if (minDif > 0) {
            tasksList[index].Dif = minDif;
          } else {
            const index = tasksList.findIndex((x) => x.id == item.id);
            tasksList[index] = {
              ...tasksList[index],
              completed: 1,
              CompleteDate: task.expectedEndDate,
              RealCompleteDate: fechaInicio,
            };
          }
        }
      });
    tasksList
      .filter((x) => x.completed == 1 && x.completedTime == null)
      .forEach((item, i) => {
        const index = tasksList.findIndex((x) => x.id == item.id);
        const task = tasksList[index];
        let startedDate = new Date(task.startedDate);
        const CompleteDate = new Date(task.CompleteDate);

        const fechaInicio = new Date(startedDate.toUTCString());
        const fechaFin = new Date(CompleteDate.toUTCString());
        const diff = fechaFin - fechaInicio;
        const minDif = diff;

        tasksList[index] = {
          ...tasksList[index],
          completedTime: minDif,
        };
      });
    tasksList.sort((a, b) => a.order - b.order);

    fs.writeFileSync(path, JSON.stringify(tasksList));
  }
  tasksList.sort((a, b) => a.order - b.order);
  res.send(tasksList);
});

app.put("/Task", (req, res) => {
  const newItem = req.body;
  var tasksList = require(path);
  if (newItem.id > 0) {
    const index = tasksList.findIndex((x) => x.id == newItem.id);
    tasksList[index] = newItem;
  } else {
    newItem.id = tasksList[tasksList.length - 1].id + 1;
    newItem.order = tasksList.length;
    tasksList.push(newItem);
  }
  tasksList.sort((a, b) => a.order - b.order);
  fs.writeFileSync(path, JSON.stringify(tasksList));
  res.send("Ok");
});
app.delete("/Task/:id", (req, res) => {
  var tasksList = require(path);
  const index = tasksList.findIndex((x) => x.id == req.params.id);
  delete tasksList[index];
  tasksList.sort((a, b) => a.order - b.order);
  fs.writeFileSync(path, JSON.stringify(tasksList.filter((x) => x != null)));
  res.send("Ok");
});
app.put("/StartTask", (req, res) => {
  const newItem = req.body;
  const today = new Date();
  const todayUTC = new Date(today.toUTCString());
  const endUTC = new Date(today.toUTCString());
  endUTC.setMinutes(endUTC.getMinutes() + Number(newItem.minutes));
  newItem.startedDate = todayUTC;
  newItem.expectedEndDate = endUTC;

  var tasksList = require(path);

  const index = tasksList.findIndex((x) => x.id == newItem.id);
  tasksList[index] = {
    ...tasksList[index],
    minutes: newItem.minutes,
    started: 1,
    startedDate: newItem.startedDate,
    expectedEndDate: newItem.expectedEndDate,
  };
  tasksList.sort((a, b) => a.order - b.order);
  fs.writeFileSync(path, JSON.stringify(tasksList));
  res.send("Ok");
});
app.put("/CompleteTask", (req, res) => {
  const newItem = req.body;
  const today = new Date();
  const todayUTC = new Date(today.toUTCString());
  newItem.CompleteDate = todayUTC;

  var tasksList = require(path);

  const index = tasksList.findIndex((x) => x.id == newItem.id);
  tasksList[index] = {
    ...tasksList[index],
    completed: 1,
    CompleteDate: newItem.CompleteDate,
  };
  fs.writeFileSync(path, JSON.stringify(tasksList));
  res.send("Ok");
});
app.put("/UpdateOrderTask", (req, res) => {
  const newTable = req.body;

  var tasksList = require(path);
  newTable.forEach((item, i) => {
    const index = tasksList.findIndex((x) => x.id == item.id);
    tasksList[index].order = i;
  });
  res.send(tasksList);
  tasksList.sort((a, b) => a.order - b.order);
  fs.writeFileSync(path, JSON.stringify(tasksList));
  res.send("Ok");
});
app.use((req, res) => {
  res.sendFile("./views/error.html", { root: __dirname });
});

app.use((req, res) => {
  res.sendFile("./views/error.html", { root: __dirname });
});
