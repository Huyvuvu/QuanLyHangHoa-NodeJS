var express = require("express");
var router = express.Router();

let { MongoClient, ObjectId } = require("mongodb-legacy");
let client = new MongoClient("mongodb://127.0.0.1:27017");
let csdl = client.db("quanlyhanghoa");
let mycollect = "mycollect"; //mycollect phải giống CSDL

let myuser = "taikhoan";
router.get("*", function (req, res, next) {
  res.locals.userId = req.session.userId
  next()
});
//=====================Đăng ký===================================
router.get("/dangky", function (req, res, next) {
  res.render("themnguoidung.ejs");
});

router.post("/dangky", function (req, res, next) {
  let dulieu = { username: req.body.txtTen, password: req.body.txtMatkhau };
  csdl
    .collection(myuser)
    .insertOne(dulieu)
    .then((dt) => {
      res.status(200).redirect("/dangnhap");
    })
    .catch((err) => {
      res.status(404).send("Không tạo được tài khoản: " + err);
    });
});
//=====================Đăng nhập===================================
router.get("/dangnhap", function (req, res, next) {
  res.render("dangnhap.ejs");
});

router.post("/dangnhap", function (req, res, next) {
  let thongtin = {
    username: req.body.txtTen,
    password: req.body.txtMatkhau
  }

  csdl.collection(myuser)
  .findOne(thongtin)
  .then(nguoidung => {
    if(!nguoidung)
    res.rendirect('/dangnhap')
    else{
      req.session.userId = nguoidung._id  
      req.flash('info','Đăng nhập thành công')
      res.status(200).redirect('/')
    }
   
  })
  .catch((err) => {res.status(404).send("Không đăng nhập được tài khoản: " + err);
  })
});
//=====================Đăng xuất===================================
router.get("/dangxuat", function (req, res, next) {
  req.session.userId = undefined;
  req.flash('info', 'Đã đăng xuất')
  res.status(200).redirect('/')
});

//Localhost:3000 or 127.0.0.1:3000 or npm start
// router.get("/", function (req, res, next) {
//   csdl
//     .collection("mycollect")
//     .find()
//     .toArray()
//     .then((dshh) => {
//       res.render('index.ejs', {dshh});
//     })
//     .catch((err) => {
//       res.status(404).send("Không xem được: " + err);
//     });
//   // res.render("index", { title: "Express" });
// });
//=====================Thêm===================================
router.get("/them", function (req, res, next) {
  res.render("themhh.ejs");
});

router.post("/them", function (req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    let dulieu = { tenhh: req.body.txtTen, soluong: req.body.txtSoluong };
    csdl
      .collection("mycollect")
      .insertOne(dulieu)
      .then((dt) => {
        res.status(200).redirect("/");
      })
      .catch((err) => {
        res.status(404).send("Không chèn được: " + err);
      });
    return;
  }

  let sampleFile, uploadPath;
  sampleFile = req.files.txtHinh;
  uploadPath = "public/img/" + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    let dulieu = {
      tenhh: req.body.txtTen,
      soluong: req.body.txtSoluong,
      hinhanh: sampleFile.name,
    };
    csdl
      .collection("mycollect")
      .insertOne(dulieu)
      .then((dt) => {
        res.status(200).redirect("/");
      })
      .catch((err) => {
        res.status(404).send("Không chèn được: " + err);
      });
  });
});

//=====================Xóa=================================
router.get("/xoa/:maso", function (req, res, next) {
  let dieukien = { _id: ObjectId.createFromHexString(req.params.maso) };
  csdl
    .collection("mycollect")
    .deleteOne(dieukien)
    .then((dt) => {
      res.status(200).redirect("/");
    })
    .catch((err) => {
      res.status(404).send("Không xóa được: " + err);
    });
});

//=====================Sửa=================================
router.get("/sua/:maso", function (req, res, next) {
  csdl
    .collection("mycollect")
    .findOne({ _id: ObjectId.createFromHexString(req.params.maso) })
    .then((hh) => {
      res.render("suahh.ejs", { hh });
    })
    .catch((err) => {
      res.status(404).send("Không sửa được" + err);
    });
});

router.post("/sua", function (req, res, next) {
  let dieukien = { _id: ObjectId.createFromHexString(req.body.txtId) };
  if (!req.files || Object.keys(req.files).length === 0) {
    let dulieumoi = {
      $set: {
        tenhh: req.body.txtTen,
        soluong: req.body.txtSoluong,
      },
    };
    csdl
      .collection("mycollect")
      .updateOne(dieukien, dulieumoi)
      .then((dt) => {
        res.status(200).redirect("/");
      })
      .catch((err) => {
        res.status(404).send("Không sửa được: " + err);
      });
    return;
  }
  let sampleFile = req.files.txtHinh;
  let uploadPath = "public/img/" + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    let dulieumoi = {
      $set: {
        tenhh: req.body.txtTen,
        soluong: req.body.txtSoluong,
        hinhanh: sampleFile.name,
      },
    };
    csdl
      .collection("mycollect")
      .updateOne(dieukien, dulieumoi)
      .then((dt) => {
        res.status(200).redirect("/");
      })
      .catch((err) => {
        res.status(404).send("Không sửa được: " + err);
      });
  });
});

//=====================Tìm===================================
router.get("/tim", function (req, res, next) {
  res.render("timhh.ejs");
});

//Phân trang
let dieukien = {};

function HienThi(req, res) {
  let tranghientai = req.params.page || 1;
  let soluong = 3;
  let tonghanghoa;

  csdl
    .collection(mycollect)
    .countDocuments(dieukien)
    .then((count) => {
      tonghanghoa = count;
      const trangcuoi = Math.ceil(tonghanghoa / soluong);
      csdl
        .collection(mycollect)
        .find(dieukien)
        .skip((tranghientai - 1) * soluong)
        .limit(soluong)
        .toArray()
        .then((dshh) => {
          res.render("index.ejs", {
            dshh, 
            tranghientai,
            tonghanghoa,
            trangcuoi,
          });
        })
        .catch((err) => {
          res.status(404).send("Không xem được: " + err);
        });
    })
    .catch((err) => {
      res.status(404).send("Không xem được: " + err);
    });
}

//localhost:3000 -> localhost:3000/1
router.get("/", function (req, res, next) {
  dieukien = {};
  res.redirect("/1");
});
router.get("/:page", function (req, res, next) {
  HienThi(req, res);
});

router.post("/tim", function (req, res, next) {
  dieukien = { tenhh: { $regex: req.body.txtTen } };
  HienThi(req, res);
});

module.exports = router;
//============================================================

//updateOne => sửa hay cập nhật dữ liệu
//updateMany => sửa hay cập nhật nhieu dữ liệu
//insertOne => thêm hay chèn  dữ liệu
//deleteOne => xóa dữ liệu
