const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "eduschool",
    });

    console.log(`
🚀 MongoDB Connected Successfully
🌍 Host: ${conn.connection.host}
📂 Database: ${conn.connection.name}
    `);

  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;