const { Op } = require('sequelize');
const {
  Products,
  Categories,
  Subcategories,
  Stock,
  Seller
} = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const fieldsForPublic = [
  'id',
  'product_id',
  'name_tm',
  'name_ru',
  'name_en',
  'body_tm',
  'body_ru',
  'body_en',
  'price',
  'image',
  'discount',
  'price_old',
];

const include = [
  {
    model: Categories,
    as: 'category',
  },
  {
    model: Subcategories,
    as: 'subcategory',
  },

  {
    model: Stock,
    as: 'product_stock',
  },
];
exports.getAll=catchAsync(async(req,res,next)=>{
    const limit = req.query.limit || 20;
    let { keyword, offset, sort } = req.query;
    let keywordsArray = [];
    if (keyword)
      keyword = keyword.toLowerCase();
      keywordsArray.push('%' + keyword + '%');
      keyword = '%' + capitalize(keyword) + '%';
      keywordsArray.push(keyword);
  
    var order;
    const sellers = await Seller.findAll({
        where: {
            name: {
                [Op.like]: {
                [Op.any]: keywordsArray,
                },
            },    
        isActive: true},
        order:[["id","DESC"]],
        limit,
        offset,
    });
    return res.status(200).send({sellers})
})
exports.sellerProduct=catchAsync(async(req,res,next)=>{
    let seller_id=req.params.id
    const seller=await Seller.findOne({where:{seller_id}})
    if(!seller){
        return next(new AppError(`Seller with id ${seller_id} not found`))
    }
    const product=await Products.findAll({
        where:{sellerId:seller.id,isActive: true},
        include:[
            {
                model: Categories,
                as: 'category',
            },
            {
                model: Subcategories,
                as: 'subcategory',
            },
            {
                model:Stock,
                as:"product_stock"
            }
        ]
    })
  return res.send({seller,product})
})
const capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };