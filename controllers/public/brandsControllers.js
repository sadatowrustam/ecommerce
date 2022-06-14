const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Brands,
    Products,
    Categories,
    Images,
    Stock,
} = require('../../models');
const { Op } = require("sequelize")
exports.getAllBrands = catchAsync(async(req, res) => {

    const brands = await Categories.findAndCountAll({
        order: [
            ["updatedAt", "DESC"]
        ],
        include: {
            model: Brands,
            as: 'category_brands',
        },
    });
    return res.status(200).send(brands);
});

exports.getBrandProducts = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: req.params.id } });
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const sort = req.query.sort;
    var order;
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];

    const products = await Products.findAll({
        where: { brandId: brand.id, isActive: true },
        order,
        limit,
        offset,
        include: [{
                model: Stock,
                as: 'product_stock',
            },
            {
                model: Images,
                as: "images",
                order: [
                    ["updatedAt", "DESC"]
                ]
            }
        ],
    });

    return res.status(200).send(products);
});
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};