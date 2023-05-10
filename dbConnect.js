const mongoose = require("mongoose");

const dbConnect = () => {
  const connParams = { useNewUrlParser: true };
  mongoose.connect(process.env.DB, connParams);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database: " + err.message);

    mongoose.connection.on("disconnected", () => {
      console.log("Mongo DB connection disconnected");
    });
  });
};

module.exports = dbConnect;
