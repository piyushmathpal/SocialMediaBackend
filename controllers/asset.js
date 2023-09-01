const Asset  =require( "../models/Asset.js");
const User =require("../models/User.js");
const Category =require("../models/Category.js");
const Asset_type= require("../models/Asset_type.js");
const cloudinary = require("../configs/cloudinary.js")

/* CREATE */
 const createAsset = async (req, res) => {
  try {
    const { user_id, description,keyword_name,category_name,asset_type,asset_category} = req.body;
    const category=await Category.findOne({category_title:category_name});
    const user = await User.findById(user_id);
    const assettype=await Asset_type.findOne({name:asset_type})
    console.log(assettype)
    if(!category)
    {
      return res.status(400).json({ message: "Invalid Category."});
    }
    if(!assettype)
    {
      return res.status(400).json({ message: "invalid Asset Type" })
    }
    if(!user)
    {
      return res.status(400).json({ message: "invalid user" })
    }
    let upload=null;
    if(asset_category==0){

       upload = await cloudinary.v2.uploader.upload(req.file.path,{folder:"asset"});
    }else{
      upload = await cloudinary.v2.uploader.upload(req.file.path,{folder:"joyOrWack"});
    }
    Number(asset_category);
    if(asset_category==0)
    {
      const newPost = new Asset({
        user_id,
        description,
        category_id:category.id,
        keyword_name,
        url:upload.secure_url,
        asset_category,
        asset_type:assettype.id
      });
      await newPost.save();
      res.status(201).json(newPost);
    }
    else if(asset_category!=0 && user.role==2)
    {
      res.status(400).json({ message: "Only Admins Are allowed to add joys and wack." });
    }
    else{
    
      const newPost = new Asset({
        user_id,
        category_id:category.id,
        url:upload.secure_url,
        asset_category,
        asset_type:assettype.id
      });
     const joyOrWack= await newPost.save();
      res.status(201).json(joyOrWack);
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
 const getFeedAssets = async (req, res) => {
  try {
    const assets = await Asset.find({asset_category:0});
    res.status(200).json(assets);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const getAllJoy = async (req, res) => {
  try {
    const assets = await Asset.find({asset_category:1});
    res.status(200).json(assets);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const getAllWack = async (req, res) => {
  try {
    const assets = await Asset.find({asset_category:2});
    res.status(200).json(assets);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

 const getUserAssets = async (req, res) => {
  try {
    const { user_id } = req.params;
    const assets = await Asset.find({ user_id });
    res.status(200).json(assets);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
 const likeAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if(!user_id){
      res.status(401).json({ message: "Unauthorized" })
    }
    const asset = await Asset.findById(id);
    console.log(asset)
    const isLiked = asset.likes.get(user_id);
    if (isLiked==1) {
      asset.likes.delete(user_id);
      asset.like_count=asset.like_count-1;
    } else {
      asset.likes.set(user_id, 1);
      asset.like_count=asset.like_count+1;
    }
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { likes: asset.likes,like_count:asset.like_count },
      { new: true }
    );

    res.status(200).json(updatedAsset);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const dislikeAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    const asset = await Asset.findById(id);
    console.log(asset)
    const isLiked = asset.likes.get(user_id);
    if (isLiked==1) {
      asset.likes.set(user_id, 2);
      asset.like_count=asset.like_count-1;
    } else if(isLiked==2){
      asset.likes.delete(user_id);
    } else {
      asset.likes.set(user_id, 2);
    
    }
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { likes: asset.likes,like_count:asset.like_count },
      { new: true }
    );

    res.status(200).json(updatedAsset);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const updateAsset = async (req, res) => {
  try {
    const {id} = req.params;
    const { user_id } = req.body;
    const asset = await Asset.findById(id);
    if(!asset){
      res.status(404).json({ message:"Asset doesnot exist."});
    }
    if (user_id==asset.user_id) {
      let picpath=asset.url
      if(req.file)
      {
        const upload = await cloudinary.v2.uploader.upload(req.file.path);
        const getPublicId = (oldUrl) => oldUrl.split("/").pop().split(".")[0];
        const deleted = await cloudinary.v2.uploader.destroy(
          getPublicId(picpath)
          );
          picpath=upload.secure_url;
      }
      await asset.updateOne({
        title,
        summary,
        content,
        cover: newPath,
      });
      const allasset = await Asset.find({});
      res.status(200).json(allasset);
      
    } else {
      res.status(403).json({"message":"You are not the author of asset"})
    }



  } catch (err) {
    res.status(404).json({ message: err.message });
  }

}



  /* DELETE POST */
  const deleteAsset = async (req, res) => {
    try {
      const {id} = req.params;
      const { user_id } = req.body;
      const asset = await Asset.findById(id);
      if(!asset){
        res.status(404).json({ message:"Asset doesnot exist." });
      }
      const oldUrl = asset.url;
      const getPublicId = (oldUrl) => oldUrl.split("/").pop().split(".")[0];
      if (user_id==asset.user_id) {
        await asset.deleteOne()
        const deleted = await cloudinary.v2.uploader.destroy(getPublicId(oldUrl));
        const allasset = await Asset.find({});
        res.status(200).json(allasset);
        
      } else {
        res.status(403).json({"message":"You are not the author of asset"})
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  module.exports ={createAsset,getFeedAssets,getUserAssets,getAllJoy,getAllWack,likeAsset,dislikeAsset,deleteAsset}