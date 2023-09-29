const mongoose = require("mongoose");


const sub_categorySchema = new  mongoose.Schema(
  {
    title: {
        type: String,
        unique: true,
      required: true,
    },
    description: {
        type: String,
      required: true,
    },
    sub_sub_category_id:{
        type:Array,
        of: mongoose.Schema.Types.ObjectId,ref:"sub_sub_category",    
    }
},
  { timestamps: true }
  
);

const Sub_CategoryModel = mongoose.model("sub_category", sub_categorySchema);

module.exports  = Sub_CategoryModel;