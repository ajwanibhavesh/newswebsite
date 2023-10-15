const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const UserCollection = require("./models/users");

mongoose.connect("mongodb://127.0.0.1:27017/news-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
// const path = dirname(fileURLToPath(import.meta.url));

// app.use(express.static(__dirname));
// app.get("/", (req, res) => {
//     res.render("login");
// });
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));

app.get("/signup", (req, res) => {
  res.render("registration");
});

app.post("/signup", async (req, res) => {
  const data = {
    userName: req.body.userName,
    name: req.body.name,
    password: req.body.password,
  };
  console.log(data);
  try {
    await UserCollection.insertMany([data]);
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await UserCollection.findOne({ name: req.body.name });
    if (user) {
      // Compare the password directly with the one in the database
      if (req.body.password === user.password) {
        res.render("index");
      } else {
        res.send(
          '<script>alert("Wrong Password"); window.location="/";</script>'
        );
      }
    } else {
      res.send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/home", (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
