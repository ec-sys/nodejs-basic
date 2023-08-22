const bodyParser = require('body-parser');
const mysql = require('mysql2');

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
  port: '3306',
  user: 'root', /* MySQL User */
  password: 'root123', /* MySQL Password */
  database: 'db_zenblog' /* MySQL Database */
});

/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results){
  return JSON.stringify({"status": 200, "error": null, "response": results});
}

/*------------------------------------------
--------------------------------------------
Shows Mysql Connect
--------------------------------------------
--------------------------------------------*/
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected with App...');
});

/**
 * Get All Items
 *
 * @return response()
 */
app.get('/api/posts',(req, res) => {
  let sqlQuery = "SELECT * FROM posts";

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Get Single Item
 *
 * @return response()
 */
app.get('/api/posts/:id',(req, res) => {
  let postId = req.params.id;
  console.log(postId);
  let sqlQuery = "SELECT * FROM posts WHERE id=" + postId;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Create New Item
 *
 * @return response()
 */
app.post('/api/posts',(req, res) => {
  let body = req.body;
  let data = {title: body.title, body: req.body.body};

  let sqlQuery = "INSERT INTO posts SET ?";

  let query = conn.query(sqlQuery, data,(err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
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