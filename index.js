const express = require("express");
const app = express();
const port = 3000;
const postRouter = require("./routes/post.router");
const auth = require("./middlewares/auth");

app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
);

app.get("/", (req, res) => {
  throw new Error('An error occurred');
  res.json({ message: "ok" });
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.use("/api/admin/posts", auth, postRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});