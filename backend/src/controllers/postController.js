const z = require("zod");

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

const updatePost = (req, res) => {};
