require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const _ = require("colors");
const PORT = process.env.PORT || 5000;

connectDB();

// Init Middleware

app.use(express.json());

app.get("/", (req, res) => res.send("hello"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

app.listen(PORT, () => console.log(`Server started ( localhost:${PORT})`.green));
