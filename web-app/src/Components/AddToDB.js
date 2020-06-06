class AddProduct {
  express = require("express");
  mysql = require("mysql");
  cors = require("cors");

  connection = mysql.createConnection({
    host: "sql01.c4wpdrivb6hb.us-east-2.rds.amazonaws.com",
    user: "ericmoy77",
    password: "1295fr1295fr",
    database: "nodemysql",
  });

  selectAllProductsQuery = "SELECT * FROM products";

  app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Go to /products to see products");
});s

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

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
}
