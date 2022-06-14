const express= require('express');
const router=express.Router();
const {getAll,sellerProduct}=require('../../../controllers/public/sellerController')
router.get("/",getAll)
router.get("/:id",sellerProduct)
module.exports=router