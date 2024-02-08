const processDate = ({ date, ...data }) => ({
  ...data,
  date: date.toDateString(),
});

module.exports = { processDate };
