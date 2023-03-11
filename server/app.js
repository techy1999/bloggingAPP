//Backend Entry point
const express = require("express");
const app = express();
require("dotenv").config();

//To post method
app.use(express.json());

// Importing
const connectDatabase = require("./configDatabase");
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");

//Connecting database
connectDatabase();

// Middleware Route
app.use("/api", blogRoutes);
app.use("/api/user", userRoutes);

// Listen on this port
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
