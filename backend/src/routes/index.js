const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const postRouter = require("./post");
const likeRouter = require("./like");
const commentRouter = require("./comment");
const friendRequestRouter = require("./friendRequest");

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/like", likeRouter);
router.use("/comment", commentRouter);
router.use("/friendRequest", friendRequestRouter);
module.exports = router;
