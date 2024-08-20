const z = require("zod");
const { User } = require("../config/db");

const postBody = z.object({
  content: z.string(),
});

const createPost = (req, res) => {
  const content = req.body.content;
  const img = req.body.img;
  res.send({
    content,
  });
};

const updatePost = async (req, res) => {
  const user = await User.findOne({ username });
};
