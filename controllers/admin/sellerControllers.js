const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Seller,Products,Categories,Subcategories } = require('../../models');

exports.addSeller=catchAsync(async (req, res, next) => {
  let {password}=req.body
  req.body.password=await bcrypt.hash(password,10)
  req.body.isActive=true
  let seller=await Seller.create(req.body)
  return res.send(seller)
})  
exports.isActive=catchAsync(async (req,res,next)=>{
  let {isActive,seller_id}=req.body
  let seller=await Seller.findOne({where:{seller_id}})
  if(!seller){
    return next(new AppError("There is no seller with this id",404))
  }
  await seller.update({isActive})
  return res.send(seller)
})
exports.allSellers=catchAsync(async(req,res,next)=>{
  let limit=req.query.limit || 20
  let {page}=req.query
  let offset=(page-1)*limit
  let seller=await Seller.findAll(
    {limit,
    offset}
  )
  let count=await Seller.count()
  return res.send({seller,count})
})
exports.oneSeller=catchAsync(async(req,res,next)=>{
  let seller_id=req.params.id
  let seller=await Seller.findOne({where:{seller_id},include:[
    {
      model:Products,
      as:"seller_product",
      include:[
        {
          model: Categories,
          as: 'category',
        },
        {
          model: Subcategories,
          as: 'subcategory',
        },
      ]},
  ]})
  return res.send(seller)
})