var express = require("express");
var router = express.Router();

let { MongoClient } = require("mongodb-legacy");

let client = new MongoClient("mongodb://127.0.0.1:27017");

let csdl = client.db("quanlydiem");
//localhost:3000 , localhost:3000/, 127.0.0.1:3000, 127.0.0.1:3000/
router.get("/them", function (req, res, next) {
  //tạo 1 collections
  csdl
    .createCollection("hocvien")
    .then((kq) => {
      res.render("index.ejs", {
        thongbao: "Đã tạo xong collection" + kq.namespace,
      });
    })
    .catch((error) => {
      res.render("error.ejs", { message: "Khong tao duoc collection", error });
    })
    .finally((_) => {
      client.close();
    });
});

module.exports = router;
