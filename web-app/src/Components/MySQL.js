//Libraries
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const connection = mysql.createConnection({
  host: "sql01.c4wpdrivb6hb.us-east-2.rds.amazonaws.com",
  user: "ericmoy77",
  password: "1295fr1295fr",
  database: "nodemysql",
});

const selectAllProductsQuery = "SELECT * FROM products";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Go to /products to see products");
});

app.get("/products", (req, res) => {
  connection.query(selectAllProductsQuery, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json(results);
    }
  });
});

app.get("/products/add", (req, res) => {
  const { msku, asin } = req.query;
  const insertProductQuery = `INSERT INTO products (msku, asin) VALUES('${msku}', '${asin}')`;
  connection.query(insertProductQuery, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("Successfully added product!");
    }
  });
});

connection.connect((err) => {
  if (err) {
    console.log("error");
  } else {
    console.log("MySQL connected!");
  }
});

// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE nodemysql";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send("Database created...");
//   });
// });

app.listen("4000", () => {
  console.log("Server started on port 4000");
});
