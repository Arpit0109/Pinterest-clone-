const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("./multer");

const userModel = require("./user");
const postmodel = require("./postModel");
const { render } = require("ejs");
const Fuse = require("fuse.js");

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});
router.get("/profile", islogedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("profile", { user });
});
router.get("/show/posts", islogedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("show", { user });
});
router.get("/feed", islogedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let posts = await postmodel.find().populate("user");

  res.render("feed", { user, posts });
});
router.get("/eachPost/:id", islogedIn, async (req, res) => {
  // let user = await userModel.findOne({ email: req.user.email });
  let post = await postmodel
    .findOne({ _id: req.params.id })
    .populate("user", "-password");

  res.render("EachPostDetalis", { post });
});
router.get("/PersonalPost/:id", islogedIn, async (req, res) => {
  // let user = await userModel.findOne({ email: req.user.email });
  let post = await postmodel
    .findOne({ _id: req.params.id })
    .populate("user", "-password");

  res.render("PersonalPost", { post });
});

router.get("/add", islogedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  res.render("add", { user });
});

router.post(
  "/createpost",
  islogedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.user.email });
      let { tital, decscription, image } = req.body;
      let post = await postmodel.create({
        user: user._id,
        tital,
        decscription,
        image: req.file.buffer,
      });
      user.posts.push(post._id);
      await user.save();
      res.redirect("/profile");
    } catch (err) {
      res.send(err.message);
    }
  }
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  let { username, email, password, contact, name } = req.body;
  let user = await userModel.findOne({ email });

  try {
    if (!user) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          let user = await userModel.create({
            username,
            password: hash,
            contact,
            email,
            name,
          });
          res.redirect("/");
        });
      });
    } else {
      res.redirect("/register");
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });

  try {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          let token = jwt.sign({ email }, "shhhhh");
          res.cookie("token", token);
          res.redirect("/profile");
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/edit", islogedIn, (req, res) => {
  let user = req.user;

  res.render("edit", { user });
});

router.post("/user/edit", islogedIn, async (req, res) => {
  // const user =   await userModel.findOne({email:req.user.email});
  let user = await userModel.findOneAndUpdate(
    { email: req.user.email },
    { name: req.body.name, username: req.body.username }
  );
  // let user = req.user;

  res.redirect("/profile");
});
router.get("/delete/:id", islogedIn, async (req, res) => {
  let post = await postmodel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/profile");
});

router.post(
  "/uploadform",
  islogedIn,
  upload.single("file"),
  async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.profileImg = req.file.buffer;
    await user.save();
    res.redirect("/profile");
  }
);
router.get("/SearchUser", islogedIn, async (req, res) => {
  const name = req.query.name.trim();

  const Fuse = require("fuse.js");
  const allUsers = await userModel.find().select("-password").populate("posts");

  const options = {
    keys: ["name"],
    threshold: 0.4,
  };

  const fuse = new Fuse(allUsers, options);

  const results = fuse.search(name);

  const matchedUsers = results.map((result) => result.item);

  res.render("SearchUser", { user: matchedUsers });
});

async function islogedIn(req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/");
  } else {
    var decoded = jwt.verify(req.cookies.token, "shhhhh");
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  }
}

module.exports = router;
