const {
    Categories,
    Products,
    Subcategories,
    Stock,
    Images,
    Brands,
} = require('../../models');
const { Op } = require("sequelize")
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const include = [{
        model: Images,
        as: 'images',
        order: [
            ["updatedAt", "DESC"]
        ]
    },
    {
        model: Stock,
        as: 'product_stock',
    }
]
exports.getAllCategories = catchAsync(async(req, res) => {
    let order = [
        ["id", "DESC"]
    ]
    const categories = await Categories.findAll({
        order,
        include: {
            model: Subcategories,
            as: 'subcategories',
        }
    });
    return res.status(200).send(categories);
});
exports.getCategoryProducts = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { category_id: req.params.id },
        include: {
            model: Brands,
            as: "category_brands"
        }
    });
    if (!category)
        return next(new AppError('Category did not found with that ID', 404));
    let where = {
        categoryId: category.id,
        isActive: true
    }
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const { sort, brand_id } = req.query;
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
    order.push(["images", "id", "DESC"])
    if (brand_id != "undefined" && brand_id) {
        const brand = await Brands.findOne({ where: { brand_id } })
        where.brandId = brand.id
    }
    const products = await Products.findAll({
        where,
        order,
        limit,
        offset,
        include
    });

    const brands = await returnBrand(products)
    return res.status(200).send({ products, category_brands: brands });
});
exports.getVip = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;

    const categories = await Categories.findAll({
        where: { isVip: true },
        limit: 4,
        order: [
            ['id', 'ASC']
        ],
        include: {
            model: Products,
            as: "category_products",
            include: {
                model: Stock,
                as: "product_stock"
            }
        },
    });

    return res.status(200).json(categories);
});
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
async function returnBrand(products) {
    let ids = []
    for (let product of products) {
        ids.push(product.brandId)
    }
    const brands = await Brands.findAll({
        where: {
            id: {
                [Op.or]: ids
            },
        }
    })
    return brands
}