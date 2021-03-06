var express = require("express");
var router = express.Router();

const Sell = require("../../models/Sell");
const Profile = require("../../models/Profile");
const State = require("../../constants/state");
//middleware
const validateSellInput = require("../../validation/sell");
const Authentication = require("../../middlewares/Authentication");
//@route  GET api/sells/test
//@desc   Test sells route
//@access Public
router.get("/test", (req, res) => res.json("Sells works"));
//@route  GET api/sells/all
//@desc   Get all sells
//@access Public
router.get("/all", (req, res, next) => {
  Sell.find({ state: State.POSTED }) //cần sửa thành POSTED
    // .map(val => val)
    .then(sell => {
      console.log(sell);

      return res.render("mains/sell/listSell", {
        sells: sell,
        title: "ALL SELL",
        total: sell.length,
        head: req.session.user
      });
    })
    .catch(err =>
      res.status(404).json({ noSellFounds: "No sell posts found." })
    );
});
//search
router.get("/search", (req, res, next) => {
  Sell.find()
    .where("state")
    .equals(State.POSTED)
    .where("hinhThuc")
    .equals(req.query.hinhThucSearch)
    .where("loai")
    .equals(req.query.loaiSearch)
    .where("adress.thanhPho")
    .equals(req.query.thanhPhoSearch)
    .sort({ dienTich: req.query.dienTichSearch, gia: req.query.giaSearch })
    .then(sell => {
      console.log(sell);

      return res.render("mains/sell/listSell", {
        sells: sell,
        title: "ALL SELL",
        total: sell.length,
        head: req.session.user
      });
    })
    .catch(err =>
      res.status(404).json({ noSellFounds: "No sell posts found." })
    );
});

router.get("/:id", (req, res, next) => {
  Sell.findById(req.params.id)
    .then(sell => {
      Profile.findOne({ user: sell.user })
        .populate("user")
        .then(profile => {
          console.log(sell.user);

          res.render("mains/sell/detailSell", {
            title: "DETAIL SELL",
            sell: sell,
            head: req.session.user,
            profile: profile
          });
        });
    })
    .catch(err =>
      res.status(404).json({ noSellFound: "No sell post for this ID." })
    );
});
router.get("/", Authentication.MEMBER, (req, res) =>
  res.render("mains/sell/postSell", {
    title: "POST SELL",
    head: req.session.user,
    errors: {},
    info: {}
  })
);

//@route  POST api/sells/
//@desc   Create sells route
//@access Private
router.post("/", Authentication.MEMBER, (req, res, next) => {
  const { errors, isValid } = validateSellInput(req.body);

  var info = {
    hinhThuc: req.body.hinhThuc,
    loai: req.body.loai,
    adress: {
      diachi: req.body.diachi,
      thanhPho: req.body.thanhPho,
      quan: req.body.quan
    },
    dienTich: req.body.dienTich,

    chiTiet: {
      matTien: req.body.matTien,
      duongVao: req.body.duongVao,
      huongNha: req.body.huongNha,
      huongBanCong: req.body.huongBanCong,
      soTang: req.body.soTang,
      soPhongNgu: req.body.soPhongNgu,
      soToilet: req.body.soToilet,
      noiThat: req.body.noiThat
    },
    moTa: req.body.moTa,
    cost: {
      gia: req.body.gia,
      donVi: req.body.donVi
    },
    imageURL: {
      image: req.body.image
    },
    state: "NEW",
    timePost: {
      fromPost: req.body.fromPost,
      toPost: req.body.toPost
    },
    cardCash: {
      menhGia: req.body.menhGia,
      idCard: req.body.idCard
    }
  };
  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.render("mains/sell/postSell", {
      title: "POST SELL",
      head: req.session.user,
      errors: errors,
      info: info
    });
  }
  const newSell = new Sell({
    user: req.session.user,
    hinhThuc: req.body.hinhThuc,
    loai: req.body.loai,
    adress: {
      diachi: req.body.diachi,
      thanhPho: req.body.thanhPho,
      quan: req.body.quan
    },
    dienTich: req.body.dienTich,

    chiTiet: {
      matTien: req.body.matTien,
      duongVao: req.body.duongVao,
      huongNha: req.body.huongNha,
      huongBanCong: req.body.huongBanCong,
      soTang: req.body.soTang,
      soPhongNgu: req.body.soPhongNgu,
      soToilet: req.body.soToilet,
      noiThat: req.body.noiThat
    },
    moTa: req.body.moTa,
    cost: {
      gia: req.body.gia,
      donVi: req.body.donVi
    },
    imageURL: {
      image: req.body.image
    },
    state: "NEW",
    timePost: {
      fromPost: req.body.fromPost,
      toPost: req.body.toPost
    },
    cardCash: {
      menhGia: req.body.menhGia,
      idCard: req.body.idCard
    }
  });
  newSell.save().then(sell =>
    Profile.findOne({ user: req.session.user })
      .populate("user")
      .then(profile => {
        return res.render("mains/sell/detailSell", {
          sell: sell,
          head: req.session.user,
          profile: profile
        });
      })
  );
});
//@route  GET api/sells/:id
//@desc   Get sell by id
//@access Public
router.delete("/:id", Authentication.MEMBER, (req, res, next) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Sell.findById(req.params.id)
      .then(sell => {
        //Check for sell owner
        if (sell.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorrzed: "User not Authorized" });
        }
        //Delete
        sell.remove().then(() => {
          res.json({ success: true });
        });
      })
      .catch(err => {
        res.status(404).json({ noSellFound: "Not sell post found" });
      });
  });
});
module.exports = router;
