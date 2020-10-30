const express = require('express');
const mysql = require('mysql');

const app = express();
app.disable("x-powered-by");

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'apps',
    password: 'artamiel.27',
    database: 'list_app'
  });

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
    connection.query(
        "SELECT * FROM items",
        (error, results) => {
          console.log(results);
          res.render("index.ejs", {items:results});
        }
    );
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/create", (req, res) => {
    console.log(req.body.itemName);
    connection.query(
        'INSERT INTO items(name) VALUES (?)',
        [req.body.itemName],
        (error, results) => {
            res.redirect('/index');
        }
      )
});

app.post("/delete/:id", (req, res) => {
    console.log(req.params.id);
    connection.query(
        'DELETE FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
    connection.query(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
          res.render('edit.ejs', {item:results[0]});
        }
    );
});

app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE items SET name = ? WHERE id = ?',
        [req.body.itemName, req.params.id],
        (error, results) => {
          res.redirect('/index');
        }
    );
})

app.listen(3000);