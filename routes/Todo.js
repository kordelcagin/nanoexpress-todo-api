const nanoexpress = require("nanoexpress");
const app = nanoexpress();

const Todo = require("../models/Todo");

app.get("/todos", async (req, res) => {
  Todo.find()
    .sort("-createdAt")
    .exec((err, todos) => {
      if (err || !todos) {
        return res.status(400).json({
          error: "Something went wrong in finding all todos",
        });
      }
      res.json({ status: "ok", data: todos });
    });
});

app.get("/todo/:id", async (req, res) => {
  const { id } = req.params;
  Todo.findById(id).exec((err, todo) => {
    if (err || !todo) {
      return res.status(400).json({
        error: "404 todo not found",
      });
    }
    res.json({ status: "ok", data: todo });
  });
});

app.post("/todo", async (req, res) => {
  const todo = new Todo(req.body);
  todo.save((err, task) => {
    if (err || !task) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
    res.json({ status: "ok", data: task });
  });
});

app.put("/todo", async (req, res) => {
  const { id, task } = req.body;

  Todo.findByIdAndUpdate(id, { task: task }, { new: true }, (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        error: "404 todo not found",
      });
    }
    res.json({ status: "ok", data: docs });
  });
});

app.del("/todo", async (req, res) => {
  const { id } = req.body;

  Todo.findByIdAndRemove(id, (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        error: "something went wrong while deleting the todo",
      });
    }
    res.json({
      status: "ok",
      task_deleted: docs,
      message: "Todo deleted successfully!",
    });
  });
});

module.exports = app;
