
const mongoose = require("mongoose");


const assetSchema = new  mongoose.Schema(
  {
    user_id: {
    type:mongoose.Schema.Types.ObjectId,ref:"user",
    required: true,
  },
    category_id: {
    type:mongoose.Schema.Types.ObjectId,ref:"category",
    required: true,
    },
    keyword_name: {
      type: Array,
      of:String
    },
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  isActive:{
    type:Boolean,
    default: true
  },
    description: String,
    asset_category:{
      type: Number,
      required: true
    },
    asset_type:{
      type: Number,
      required: true,
    },
    like_count:{type:Number,default:0},
    share_count:{type:Number,default:0},
  },
  { timestamps: true }
);

const AssetModel = mongoose.model("asset", assetSchema);

module.exports  = AssetModel;