const bodyParser = require('body-parser');
const mysql = require('mysql');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());


/*------------------------------------------
--------------------------------------------
Database Connection
--------------------------------------------
--------------------------------------------*/
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root', /* MySQL User */
  password: 'root123', /* MySQL Password */
  database: 'db_zenblog' /* MySQL Database */
});

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

/**
 * Create New Item
 *
 * @return response()
 */
app.post('/api/posts',(req, res) => {
  // let data = {title: req.body.title, body: req.body.body};
  //
  // let sqlQuery = "INSERT INTO posts SET ?";
  //
  // let query = conn.query(sqlQuery, data,(err, results) => {
  //   if(err) throw err;
  //   res.send(apiResponse(results));
  // });
  let data = {title: req.body.title, body: req.body.body}
  console.log(data);
  res.send('Get Post With Id: ' + data);
});


/**
 * Update Item
 *
 * @return response()
 */
app.put('/api/posts/:id',(req, res) => {
  let sqlQuery = "UPDATE items SET title='"+req.body.title+"', body='"+req.body.body+"' WHERE id="+req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});