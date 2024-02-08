const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const {
  createUser,
  findAllUsers,
  createExercise,
  findUserById,
  findExercisesById,
} = require("./db");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const newUser = {
    username: req.body.username,
  };
  try {
    const { username, _id } = await createUser(newUser);
    res.json({ username, _id });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/api/users", async (_, res) => {
  try {
    data = await findAllUsers();
    res.json(data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  // need to add validation
  try {
    const userID = req.params["_id"];
    // req.body has description, duration, and date
    const { description, duration, date } = await createExercise({
      userID,
      ...req.body,
    });

    const { username } = await findUserById(userID);
    res.json({ description, duration, date, username, _id: userID });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const userID = req.params["_id"];
    const { to, from, limit } = req.query;
    const queryParams = {
      ...(to && { to }),
      ...(from && { from }),
      ...(limit && { limit }),
    };

    const { username } = await findUserById(userID);
    const exercises = await findExercisesById(userID, queryParams);
    res.json({
      _id: userID,
      username,
      count: exercises.length,
      ...queryParams,
      log: exercises,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
