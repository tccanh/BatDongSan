const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
//Create schema
const FindSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  hinhThuc: {
    type: String,
    required: true,
    enum: ["sell", "rent"]
  },
  loai: {
    type: String,
    required: true
  },
  adress: [
    {
      thanhPho: {
        type: String,
        required: true
      },
      quan: {
        type: String,
        required: true
      }
    }
  ],
  dienTich: [
    {
      fromDienTich: {
        type: Number,
        required: true
      },
      toDienTich: {
        type: Number,
        required: true
      }
    }
  ],

  cost: [
    {
      fromCost: {
        type: Number,
        default: 0
      },
      toCost: {
        type: Number,
        default: 0
      },
      donVi: {
        type: String,
        required: true
      }
    }
  ],
  state: {
    type: String,
    required: true,
    enum: ["NEW", "STORAGE", "POSTED"],
    default: "NEW"
  },
  timePost: [
    {
      fromPost: {
        type: Date,
        default: Date.now()
      },
      toPost: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  cardCash: {
    menhGia: {
      type: Number,
      required: true
    },
    idCard: {
      type: Number,
      required: true
    }
  }
});
module.exports = mongoose.model("finds", FindSchema);
FindSchema.pre("save", function(next) {
  this.timePost.fromPost = moment(this.timePost.fromPost).format(
    "MMMM DD,YYYY"
  );
  this.timePost.toPost = moment(this.timePost.toPost).format("MMMM DD,YYYY");
  next();
});
