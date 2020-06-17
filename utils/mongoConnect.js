const mongoose = require("mongoose");

require("dotenv").config();

module.exports = () => {
  try {
    mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.msg);
    process.exit(1);
  }
};
