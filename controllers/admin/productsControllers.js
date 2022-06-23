const fs = require('fs');
const sharp = require('sharp');
const { v4 } = require("uuid")
const Op = require('sequelize').Op;
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const {
    Products,
    Categories,
    Subcategories,
    Stock,
    Currency,
    Brands,
    Images
} = require('../../models');
const include = [{
    model: Images,
    as: "images",
    order: [
        ["id", "DESC"]
    ]
}];
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.getAllActiveProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    let { keyword, categoryId, subcategoryId, isActive, offset } = req.query;
    let where = {}
    if (isActive != "undefined") {
        where.isActive = isActive
    }
    if (keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where = {
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
        };
    }
    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    const products = await Products.findAll({
        where,
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ],
        include
    });
    const count = await Products.count()
    return res.status(200).send({ products, count });
});
exports.getAllNonActiveProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    let { offset, keyword, categoryId, subcategoryId, brandId } = req.query;

    var where = {
        isActive: false,
    };
    if (keyword) {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);

        where = {
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
                {
                    name_en: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
            ],
            isActive: false,
        };
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId

    const products = await Products.findAll({
        where,
        limit,
        offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include,
    });

    return res.status(200).send(products);
});

exports.addProduct = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { category_id: req.body.category_id },
    });
    const date = new Date()
    req.body.is_new_expire = date.getTime()
    if (!category)
        return next(new AppError('Category did not found with that ID', 404));

    if (req.body.subcategory_id) {
        const subcategory = await Subcategories.findOne({
            where: { subcategory_id: [req.body.subcategory_id] },
        });
        if (!subcategory)
            return next(new AppError('Sub-category did not found with that ID', 404));
        req.body.subcategoryId = subcategory.id;
    }
    if (req.body.brand_id) {
        const brand = await Brands.findOne({
            where: { brand_id: req.body.brand_id }
        })
        if (!brand)
            return next(new AppError("Brand did not found with that Id"), 404)
        req.body.brandId = brand.id
    }
    if (req.body.price_usd) {
        req.body.price_tm = null
        req.body.price_tm_old = null
        req.body.price_old = null
        req.body.price_usd_old = null
        let currency = await Currency.findOne()
        if (req.body.discount > 0) {
            req.body.price_usd_old = req.body.price_usd;
            req.body.price_usd =
                (req.body.price_usd_old / 100) *
                (100 - req.body.discount);
            req.body.price_old =
                req.body.price_usd_old * currency.value;
        }
        req.body.price = req.body.price_usd * currency.value
    } else {
        req.body.price_usd = null;
        req.body.price_usd_old = null;
        req.body.price_old = null;
        req.body.price_tm_old = null
        if (req.body.discount > 0) {
            req.body.price_tm_old = req.body.price_tm;
            req.body.price_tm =
                (req.body.price_tm_old / 100) *
                (100 - req.body.discount);
            req.body.price_old = req.body.price_tm_old;
        }
        req.body.price = req.body.price_tm;
    }
    let quantity = Number(req.body.stock)
    req.body.categoryId = category.id;
    req.body.isActive = true
    const newProduct = await Products.create(req.body);
    await Stock.create({
        productId: newProduct.id,
        quantity
    });
    return res.status(201).send(newProduct);
});
exports.getOneProduct = catchAsync(async(req, res, next) => {
    const { product_id } = req.params
    const oneProduct = await Products.findOne({
        where: { product_id },
        include: [{
                model: Images,
                as: "images"
            },
            {
                model: Stock,
                as: "product_stock"
            },
            {
                model: Categories,
                as: "category"
            },
            {
                model: Subcategories,
                as: "subcategory"
            },
            {
                model: Brands,
                as: "brand"
            }
        ]
    })
    return res.send(oneProduct)
})
exports.editProduct = catchAsync(async(req, res, next) => {
    console.log(req.body)
    const product = await Products.findOne({
        where: { product_id: req.params.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    if (req.body.category_id) {
        const category = await Categories.findOne({
            where: { category_id: [req.body.category_id] },
        });
        if (!category)
            return next(
                new AppError('Category did not found with your category_id', 404)
            );
        req.body.categoryId = category.id;
    }
    if (req.body.subcategory_id) {
        const subcategory = await Subcategories.findOne({
            where: { subcategory_id: [req.body.subcategory_id] },
        });
        if (!subcategory)
            return next(
                new AppError('Sub-category did not found with your subcategory_id', 404)
            );
        req.body.subcategoryId = subcategory.id;
    }
    if (req.body.price_usd) {
        req.body.price_tm = null
        req.body.price_tm_old = null
        req.body.price_old = null
        req.body.price_usd_old = null
        let currency = await Currency.findOne()
        if (req.body.discount > 0) {
            req.body.price_usd_old = req.body.price_usd;
            req.body.price_usd =
                (req.body.price_usd_old / 100) *
                (100 - req.body.discount);
            req.body.price_old =
                req.body.price_usd_old * currency.value;
        }
        req.body.price = req.body.price_usd * currency.value
    } else {
        req.body.price_usd = null
        req.body.price_usd_old = null
        req.body.price_old = null
        req.body.price_tm_old = null
        if (req.body.discount > 0) {
            req.body.price_tm_old = req.body.price_tm;
            req.body.price_tm =
                (req.body.price_tm_old / 100) *
                (100 - req.body.discount);
            req.body.price_old = req.body.price_tm_old;
        }
        req.body.price = req.body.price_tm;
    }
    await product.update(req.body);
    if (req.body.stock) {
        req.body.stock = Number(req.body.stock)
        if (typeof req.body.stock != 'number')
            return next(new AppError('stock_quantity must be in number', 400));
        const stock = await Stock.findOne({ where: { productId: product.id } });
        await stock.update({ stock_quantity: req.body.stock });
    }
    return res.status(200).send(product);
});
exports.editProductStatus = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({
        where: { product_id: req.params.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    await product.update({
        isActive: req.body.isActive,
    });

    return res.status(200).send(product);
});

exports.deleteProduct = catchAsync(async(req, res, next) => {
    const product_id = req.params.id;
    const product = await Products.findOne({ where: { product_id } });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    const images = await Images.findAll({ where: { productId: product.id } })
    for (const image of images) {
        fs.unlink(`static/${image.image}`, function(err) {
            if (err) throw err;
        })
        await image.destroy()
    }
    const stock = await Stock.findOne({ where: { productId: [product.id] } });
    await stock.destroy();
    await product.destroy();
    return res.status(200).send('Successfully Deleted');
});
exports.uploadProductImage = catchAsync(async(req, res, next) => {
    const product_id = req.params.id;
    const updateProduct = await Products.findOne({ where: { product_id } });
    let images = []
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)

    if (!updateProduct)
        return next(new AppError('Product did not found with that ID', 404));
    for (const one_image of req.files) {
        const image_id = v4()
        const image = `${image_id}_product.webp`;
        const photo = one_image.data

        let buffer = await sharp(photo).webp().toBuffer()
        await sharp(buffer).toFile(`static/${image}`);
        let newImage = await Images.create({ image, image_id, productId: updateProduct.id })
        images.push(newImage)
    }
    return res.status(201).send(images);
});
exports.deleteProductImage = catchAsync(async(req, res, next) => {
    const image = await Images.findOne({ where: { image_id: req.params.id } })

    fs.unlink(`static/${image.image}`, function(err) {
        if (err) throw err;
    })
    await image.destroy()
    return res.status(200).send({ msg: "Sucess" })

})
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}