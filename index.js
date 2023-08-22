const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.get('/post', (req, res) => {
  let postId = req.query.id;
  console.log(postId);
  res.send('Get Post With Id' + postId);
})

/**
 * Get Single Item
 *
 * @return response()
 */
app.get('/api/posts/:id',(req, res) => {
  // let sqlQuery = "SELECT * FROM items WHERE id=" + req.params.id;
  //
  // let query = conn.query(sqlQuery, (err, results) => {
  //   if(err) throw err;
  //   res.send(apiResponse(results));
  // });
  let postId = req.params.id;
  console.log(postId);
  res.send('Get Post With Id: ' + postId);
});