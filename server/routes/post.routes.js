const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

function sortPosts(type, posts) {
  const directionSort = type === "asc";
  const compare = (a, b) => {
    if (a.title > b.title) {
      return directionSort ? 1 : -1;
    }
    if (a.title <= b.title) {
      return directionSort ? -1 : 1;
    }

    return 0;
  };

  return [...posts].sort(compare);
}

router.get("/", async (req, res) => {
  try {
    const list = await Post.find();
    res.status(200).send(list);
  } catch (e) {
    console.log("---Erorr---/", e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.post("/search", async (req, res) => {
  const { searchValue, registr, startIndex, count, sortType, userId } =
    req.body;

  try {
    const flagI = registr ? "" : "i";
    const reg = new RegExp(`${searchValue}`, flagI);
    let foundTitle = [];
    let foundBody = [];

    if (userId) {
      foundTitle = await Post.find({ title: reg, userId });
      foundBody = await Post.find({ body: reg, userId });
    } else {
      foundTitle = await Post.find({ title: reg });
      foundBody = await Post.find({ body: reg });
    }

    const foundResult = [
      ...new Set([
        ...foundTitle.map((el) => JSON.stringify(el)),
        ...foundBody.map((el) => JSON.stringify(el)),
      ]),
    ];

    const totalCount = foundResult.length;
    const postsList = foundResult
      .map((el) => JSON.parse(el))
      .slice(startIndex, startIndex + count);
    const postsListSort = sortPosts(sortType, postsList);

    res.status(201).send({ postsList: postsListSort, totalCount });
  } catch (e) {
    console.log("---Erorr---/", e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.post("/paginate", async (req, res) => {
  const { startIndex, count, sortType, userId } = req.body;
  const sortNumber = sortType === "asc" ? 1 : -1;
  try {
    let postsList = [];
    let totalCount = 0;

    if (userId) {
      totalCount = await Post.count({ userId });
      postsList = await Post.find({ userId })
        .sort({ title: sortNumber })
        .skip(startIndex)
        .limit(count);
    } else {
      totalCount = await Post.count();

      postsList = await Post.find()
        .sort({ title: sortNumber })
        .skip(startIndex)
        .limit(count);
    }

    res.status(201).send({ postsList, totalCount });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const post = await Post.findById(_id);

    res.status(200).send(post);
  } catch (e) {
    console.log("---Erorr---/", e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.post("/new", auth, async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    res.status(201).json(newPost);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.delete("/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const removeedPost = await Post.findById(postId);

    await removeedPost.remove();

    return res.json(null);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

router.patch("/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    res.json(updatedPost);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже." });
  }
});

module.exports = router;
