//Backend Entry point
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//To post method
app.use(express.json());

app.use(cors());

// Importing
const connectDatabase = require("./configDatabase");
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");

//Connecting database
connectDatabase();

app.use(morgan());
// Middleware Route
app.use("/api", blogRoutes);
app.use("/api/user", userRoutes);

// Listen on this port
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
