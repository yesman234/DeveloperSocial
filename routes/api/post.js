const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// Post api/post
// create a post route
//private access
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// get api/get
// create a get route
//private access
router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});
// get api/get
// create a get route
//private access
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE api/post/:id
// delete a post
//private access
router.delete("/", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ msg: "post not found" });
    }
    //check user authentication
    if (post.user.toString() !== req.params.id) {
      res.status(401).json({ msg: "user not authenticated" });
    }

    await post.remove();

    res.json({ msg: "post removed" });
  } catch (err) {
    console.err(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Post api/post/like/:id
// like a post
//private access
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await post.findById(req.params.id);

    //check if post has already been liked
    if (
      post.likes.filter(like => (like.user.toString() = req.user.id)).length > 0
    ) {
      return res.status(400).json({ msg: "post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Post api/post/like/:id
// like a post
//private access
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await post.findById(req.params.id);

    //check if post has already been liked
    if (
      post.likes.filter(like => (like.user.toString() = req.user.id)).length ===
      0
    ) {
      return res.status(400).json({ msg: "post has not been liked yet" });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Post api/post/comment?:id
// comment on a post
//private access
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// delete api/post/comment?:id
// comment on a post
//private access
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "comment does not exist" });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//CHECKKKKKK  YOUR PUT ROUTE FOR COMMENTS down BELOW
// Put api/post/comment?:id
// comment on a post
//private access
router.put(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
