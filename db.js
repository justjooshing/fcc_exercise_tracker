const { connect, Schema, model } = require("mongoose");

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
  const data = await Exercise.create({
    userID,
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  });

  return {
    description: data.description,
    duration: data.duration,
    date: data.date.toDateString(),
  };
};

const findExercisesById = async (userID, { to, from, limit }) => {
  const query = {
    userID,
  };

  if (to) {
    query.date = {};
    query.date["$lte"] = to;
  }
  if (from) {
    if (!query.date) {
      query.date = {};
    }
    query.date["$gte"] = from;
  }

  const data = await Exercise.find(query, {
    date: 1,
    duration: 1,
    description: 1,
    _id: 0,
  }).limit(limit);

  return data.map(({ date, description, duration }) => ({
    date: date.toDateString(),
    description,
    duration,
  }));
};

module.exports = {
  createUser,
  findAllUsers,
  createExercise,
  findUserById,
  findExercisesById,
};
