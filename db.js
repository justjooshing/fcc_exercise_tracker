const { connect, Schema, model } = require("mongoose");
const { processDate } = require("./helpers");

const db = connect(process.env.MONGODB_URL);

const UserSchema = new Schema({
  username: String,
});

const ExerciseSchema = new Schema({
  userID: String,
  description: String,
  duration: Number,
  date: Date,
});

const User = model("UserSchema", UserSchema, "users");
const Exercise = model("ExerciseSchema", ExerciseSchema, "exercises");

const createUser = async (user) => {
  return await User.create(user);
};

const findUserById = async (_id) => {
  return await User.findOne({ _id });
};

const findAllUsers = async () => {
  return await User.find({});
};

const createExercise = async ({ userID, description, duration, date }) => {
  const result = await Exercise.create({
    userID,
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  });
  return processDate(result);
};

const findExercisesById = async (userID, { to, from, limit }) => {
  const result = await Exercise.find(
    { userID, date: { $gte: from, $lte: to } },
    {
      date: 1,
      duration: 1,
      description: 1,
      _id: 0,
    },
    { lean: true }
  ).limit(limit);

  return result.map(processDate);
};

module.exports = {
  createUser,
  findAllUsers,
  createExercise,
  findUserById,
  findExercisesById,
};
