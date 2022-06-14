const { Op } = require('sequelize');
const appError = require('../../utils/appError')
const {
    Products,
    Categories,
    Subcategories,
    Stock,
    Brands,
    Images
} = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
exports.getProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 10;
    const { offset, sort, brand_id } = req.query;
    var order, where;
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
    where = {
        [Op.or]: [
            { isGift: true },
            { isNew: true },
            { isAction: true },
            {
                discount: {
                    [Op.ne]: 0
                }
            }
        ]
    }
    if (brand_id != "undefined" && brand_id) {
        const brand = await Brands.findOne({ where: { brand_id } })
        where.brandId = brand.id
    }
    const products = await Products.findAll({
        isActive: true,
        limit,
        offset,
        where,
        include: [{
                model: Images,
                as: "images"
            },
            {
                model: Stock,
                as: "product_stock"
            }
        ],
        order
    });
    const brands = await returnBrand(products)
    return res.status(200).json({ products, brands });
});
// Search
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.searchProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    let { keyword, offset, sort } = req.query;
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

    let keywordsArray = [];
    keyword = keyword.toLowerCase();
    keywordsArray.push('%' + keyword + '%');
    keyword = '%' + capitalize(keyword) + '%';
    keywordsArray.push(keyword);
    const products = await Products.findAll({
        where: {
            [Op.or]: [{
                    name_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    name_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },

                },
            ],
            isActive: true,
        },
        include: {
            model: Images,
            as: "images"
        },
        order,
        limit,
        offset,
    });

    return res.status(200).send({ products });
});
exports.getOneProduct = catchAsync(async(req, res, next) => {
    const product_id = req.params.id
    const oneProduct = await Products.findOne({
        where: { product_id },
        include: [{
                model: Stock,
                as: "product_stock"
            },
            {
                model: Categories,
                as: "category",
            },
            {
                model: Subcategories,
                as: "subcategory"
            },
            {
                model: Brands,
                as: "brand"
            },
            {
                model: Images,
                as: "images",
            }
        ],
        order: [
            ["images", "id", "DESC"]
        ]
    })
    if (!oneProduct) {
        return next(new appError("Can't find product with that id"), 404);
    }
    const id = oneProduct.categoryId
    const recommenendations = await Categories.findAll({
        where: { id },
        include: {
            model: Products,
            as: "products",
            where: {
                id: {
                    [Op.ne]: oneProduct.id
                }
            },
            limit: 4,
            include: [{
                model: Stock,
                as: 'product_stock',
            }, {
                model: Images,
                as: "images",
            }],
            order: [
                ["id", "DESC"],
                ["images", "id", "DESC"]
            ],
        }
    })
    const product = {
        oneProduct,
        recommenendations
    }
    return res.send(product)
})
exports.discount = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_id } = req.query;
    let order, where;
    where = {
        isActive: true,
        discount: {
            [Op.ne]: 0
        },
    }
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
    const discount_products = await Products.findAll({
        where,
        order,
        limit,
        offset,
        include: [{
            model: Stock,
            as: 'product_stock',
        }, {
            model: Images,
            as: "images",
            order: [
                ["images", "id", "DESC"]
            ]
        }]
    });
    const brands = await returnBrand(discount_products)
    return res.status(200).send({ discount_products, brands })
})
exports.actionProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_id } = req.query;
    let order, where;
    where = {
        isActive: true,
        isAction: true
    }
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
    const action_products = await Products.findAll({
        where,
        order,
        limit,
        offset,
        include: [{
            model: Stock,
            as: 'product_stock',
        }, {
            model: Images,
            as: "images"
        }]
    });
    const brands = await returnBrand(action_products)
    return res.status(200).send({ action_products, brands })
})
exports.giftProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_id } = req.query;
    let order, where;
    where = {
        isActive: true,
        isGift: true
    }
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        [
            ["updatedAt", "DESC"],
        ],
    ];
    order.push(["images", "id", "DESC"])
    if (brand_id != "undefined" && brand_id) {
        const brand = await Brands.findOne({ where: { brand_id } })
        where.brandId = brand.id
    }
    const gift_products = await Products.findAll({
        where,
        limit,
        offset,
        include: [{
            model: Stock,
            as: 'product_stock',
        }, {
            model: Images,
            as: "images",
        }],
        order
    });
    const brands = await returnBrand(gift_products)
    return res.status(200).send({ gift_products, brands })
})
exports.newProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const { sort, brand_id } = req.query;
    let order
    let where = {
        isNew: true,
        isActive: true
    }
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        [
            ["updatedAt", "DESC"],
        ],
    ];
    if (brand_id != "undefined" && brand_id) {
        const brand = await Brands.findOne({ where: { brand_id } })
        where.brandId = brand.id
    }
    order.push(["images", "id", "DESC"])
    const new_products = await Products.findAll({
        where,
        limit,
        offset,
        include: [{
                model: Stock,
                as: 'product_stock',
            },
            {
                model: Images,
                as: "images",
            }
        ],
        order
    })
    const brands = await returnBrand(new_products)
    return res.status(200).send({ new_products, brands }, );
});
exports.setRating = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({ where: { product_id: req.params.id } })
    if (!product) {
        return next(new AppError("Product not found"), 404)
    }
    let rating = ((product.rating * product.rating_count) + req.body.rating) / (product.rating_count + 1)
    await product.update({ rating, rating_count: product.rating_count + 1 })
    return res.status(200).send({ product })
})

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