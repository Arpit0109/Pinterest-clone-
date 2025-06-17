const express = require("express");
const app = express();

const cookieparser = require("cookie-parser");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieparser());

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

app.use("/", indexRouter);
// app.use("/user",userRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000:");
});
