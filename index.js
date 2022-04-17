// import all the necessary packages
const nanoexpress = require("nanoexpress");
const mongoose = require("mongoose");
const bodyParser = require("@nanoexpress/middleware-body-parser/cjs");
require("dotenv").config();

// we are using port 8000
const port = 8000;
const app = nanoexpress();

app.use(bodyParser());

// DB connection
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("Connected to DB");
  }
);

app.get("/", (req, res) => {
  return res.send({ status: true });
});

const Todo = require("./models/Todo");
app.get("/todos", async (req, res) => {
  Todo.find()
    .sort("-createdAt")
    .exec((err, todos) => {
      // error checking
      if (err || !todos) {
        return res.status(400).json({
          error: "Something went wrong in finding all todos",
        });
      }
      res.json({ status: true, data: todos });
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
    res.json({ status: true, data: todo });
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
    res.json({ status: true, data: task });
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
    res.json({ status: true, data: docs });
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
      status: true,
      deleted: docs,
    });
  });
});

const todoRoutes = require("./routes/Todo");
app.use("/api", todoRoutes);

app.listen(port);
