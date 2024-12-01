//createCollection => tạo 1 collection
//insertOne => chèn 1 document vào collection
//insertMany => chèn nhiều document vào collection
//find toArray => xem hết dữ liệu
//findOne => xem 1 dữ liệu
//deleteOne => xóa 1 document trong collection
//drop => xóa 1 collection cách 1
//dropCollection => xóa 1 collection cách 2

//updateOne => sửa hay cập nhật dữ liệu
//insertOne => thêm hay chèn  dữ liệu
//deleteOne => xóa dữ liệu
//-----------------------------------------
//kết nối từ mongodb với database

let { MongoClient } = require("mongodb-legacy");

let client = new MongoClient("mongodb://127.0.0.1:27017");

let csdl = client.db("quanlydiem");

// console.log(csdl.namespace);

//-----------------------------------------

//tạo server để hiện thi trên website
let http = require("http");
require("http")
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
  })
  .listen(8081, (_) => {
    console.log("Server running at http://127.0.0.1:8081/");
  });

//-----------------------------------------
//tạo 1 collections
function taocollection(csdl) {
  csdl
    .createCollection("monhoc")
    .then((kq) => {
      console.log("Da tao xong", kq.namespace);
    })
    .catch((err) => {
      console.log("Khong tao duoc collection", err);
    })
    .finally((_) => {
      client.close();
    });
}

//-----------------------------------------

//chèn thêm 1 dữ liệu
function chen1collection(csdl) {
  csdl
    .collection("congty")
    .insertOne({ tenmh: "Python", sotc: 90 })
    .then((ketqua) => {
      console.log("Da chen xong du lieu", ketqua);
    })
    .catch((err) => {
      console.log("Khong chen dc du lieu", err);
    })
    .finally(() => client.close());
}
// chen1collection(csdl);

//-----------------------------------------

//chèn nhiều document
function chennhieudocument(mycollect) {
  csdl
    .collection(mycollect)
    .insertMany([
      { tennv: "Huy", diachi: "AuCo" },
      { tennv: "Tiên", diachi: "LacLongQuan" },
      { tennv: "Vũ", diachi: "QuangTrung" },
    ])
    .then((ketqua) => console.log("da chen xong", ketqua))

    .catch((err) => console.log("Khong chen dc du lieu", err))
    .finally((_) => client.close());
}
// chennhieudocument("nhanvien"); //chèn nhiều document vào collection nhân viên(tự xuất hiện collection nhân viên k cần tạo)

//-----------------------------------------

//đếm 1 collection
function demsoluongdocument(mycollect) {
  csdl
    .collection(mycollect)
    .countDocuments({})
    .then((ketqua) => {
      console.log("So dong du lieu", ketqua);
    })
    .catch((err) => {
      console.log("Khong dem dc du lieu", err);
    })
    .finally(() => client.close());
}
// demsoluongdocument("monhoc"); //1
// demsoluongdocument("sinhvien"); //12

//-----------------------------------------

//XEM DỮ LIỆU TRONG COLLECTIONS
//1. xem hết dữ liệu thì find toArray
function xemhetdulieu(mycollect) {
  csdl
    .collection("nhanvien")
    .find()
    .toArray()
    .then((ketqua) => console.log("xem het du lieu", ketqua))
    .catch((err) => console.log("Khong xem duoc het lieu", err))
    .finally((_) => client.close());
}

//xem 1 dữ liệu thì findOne
function xem1dulieu(mycollect) {
  csdl
    .collection("nhanvien")
    .findOne()
    .then((ketqua) => console.log("xem 1 du lieu", ketqua))
    .catch((err) => console.log("Khong xem duoc 1 du lieu", err))
    .finally((_) => client.close());
}
// xemhetdulieu("nhanvien");
// xem1dulieu("nhanvien");

//-----------------------------------------
// async function findFunction(csdl, mycollect){​​​​​​
//   try{​​​​​​
//       const csdl = await client.db(csdl);
//       const collection = await csdl.collection(mycollect);
//       const ketQua = await collection.find();
//       const ketQuaFinal = await ketQua.toArray();
//       console.log(ketQuaFinal);

//   }​​​​​​
//   catch (e) {​​​​​​
//       console.log('co loi xay ra');
//       console.log(e)
//   }​​​​​​
//   finally{​​​​​​
//       client.close();
//       console.log('dong ket noi');
//   }​​​​​​
// }​​​​​​
// findFunction('quanlydiem', 'nhanvien');
// //nhung ham nay khong duoc thieu 'await'
// async function findOneFunction(csdl, mycollect){​​​​​​
//   try{​​​​​​
//       const csdl = await client.db(csdl);
//       const collection = await csdl.collection(mycollect);
//       const ketQua = await collection.findOne();
//       console.log(ketQua);

//   }​​​​​​
//   catch (e) {​​​​​​
//       console.log('co loi xay ra');
//       console.log(e)
//   }​​​​​​
//   finally{​​​​​​
//       client.close();
//       console.log('dong ket noi');
//   }​​​​​​
// }​​​​​​
// findOneFunction('quanlydiem', 'nhanvien');

//-----------------------------------------
//xóa 1 dữ liệu
function xoa1dulieu(mycollect) {
  csdl
    .collection(mycollect)
    .deleteOne({ tennv: "Vũ" })
    .then((ketqua) => console.log("da xoa  1 du lieu document", ketqua))
    .catch((err) => console.log("Khong xoa duoc 1 du lieu document", err))
    .finally((_) => client.close());
}
// xoa1dulieu("nhanvien");

//-----------------------------------------
//1. xóa 1 collection = table
function xoa1collection(mycollect) {
  csdl
    .collection(mycollect)
    .drop()
    .then((ketqua) => console.log("da xoa  1 collection", ketqua))
    .catch((err) => console.log("Khong xoa duoc 1 collection", err))
    .finally((_) => client.close());
}
// xoa1collection("diemthi");

//2. xóa 1 collection = table
function xoa1collection2(mycollect) {
  csdl
    .dropcollection(mycollect)
    .then((ketqua) => console.log("da xoa  1 collection", ketqua))
    .catch((err) => console.log("Khong xoa duoc 1 collection", err))
    .finally((_) => client.close());
}
// xoa1collection2("diemthi");

//-----------------------------------------
//câp nhật collection

function updatecollection(mycollect, dieukien, giatrimoi) {
  csdl
    .collection(mycollect)
    .updateOne(dieukien, giatrimoi)
    .then((ketqua) => console.log("da update 1 collection", ketqua))
    .catch((err) => console.log("Khong update duoc 1 collection", err))
    .finally((_) => client.close());
}

// updatecollection("sinhvien", { tensv: "itc" }, { $set: { tuoi: "99" } });
