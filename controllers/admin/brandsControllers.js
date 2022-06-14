const sharp = require('sharp');
const fs = require('fs');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Brands,
    Products,
    Stock,
    Categories,
    Categoriesbrands,
    Images
} = require('../../models');

exports.addBrand = catchAsync(async(req, res, next) => {
    const newBrand = await Brands.create(req.body);
    return res.status(201).send(newBrand);
});
exports.getUnlimited = catchAsync(async(req, res, next) => {
    const brands = await Brands.findAndCountAll({
        order: [
            ["id", "DESC"]
        ]
    });
    return res.status(200).send(brands)
})
exports.getAllBrands = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const sort = req.query
    let { keyword } = req.query
    let order
    order = [
        ["id", "DESC"]
    ]
    if (sort.name == "id" && sort.bool == "true") {
        order = [
            ["id", "ASC"]
        ]
    } else if (sort.name == "id" && sort.bool == "false") {
        order = [
            ["id", "DESC"]
        ]
    } else if (sort.name == "name" && sort.bool == "true") {
        order = [
            ["name", "DESC"]
        ]
    } else if (sort.name == "name" && sort.bool == "false") {
        order = [
            ["name", "ASC"]
        ]
    }
    var keywordsArray = ["%%"]
    if (keyword != 'undefined') {
        keywordsArray = []
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
    }
    const brands = await Brands.findAndCountAll({
        limit,
        offset,
        order,
        include: {
            model: Categories,
            as: 'brand_categories',
        },
        where: {
            name: {
                [Op.like]: {
                    [Op.any]: keywordsArray,
                },
            },
        },
    });
    return res.status(200).send(brands);
});
exports.addBrandCategory = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: req.params.id } });
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));
    const category = await Categories.findOne({
        where: { category_id: req.body.category_id },
    });
    if (!category)
        return next(new AppError('Category did not found with category_id', 404));
    await Categoriesbrands.destroy({
        where: {
            "brandId": brand.id
        },
    });
    await Categoriesbrands.create({
        brandId: brand.id,
        categoryId: category.id,
    });
    return res.status(201).json({
        msg: 'Successfully added',
    });
});

exports.editBrand = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: [req.params.id] } });
    console.log(req.body)
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    const { name } = req.body;
    if (
        typeof name !== 'string' ||
        name.length < 1
    )
        return next(new AppError('Invalid Credentials', 400));

    await brand.update({ name });

    return res.status(200).send(brand);
});

exports.deleteBrand = catchAsync(async(req, res, next) => {
    const brand_id = req.params.id;
    const brand = await Brands.findOne({ where: { brand_id } });

    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    if (brand.image) {
        fs.unlink(`static/${brand_id}.webp`, function(err) {
            if (err) throw err;
        });
    }
    const products = await Products.findAll({
        where: { brandId: [brand.id] },
        include: {
            model: Images,
            as: "images"
        }
    });
    if (products) {
        for (const product of products) {
            if (product.images) {
                product.images.forEach(async(image) => {
                    fs.unlink(
                        `static/${image.image}.webp`,
                        function(err) {
                            if (err) throw err;
                        }
                    );
                })
            }

            await Stock.destroy({ where: { productId: [product.id] } });
            await product.destroy();
        }

    };
    await Categoriesbrands.destroy({ where: { brandId: brand.id } });
    await brand.destroy();

    return res.status(200).send('Successfully Deleted');
});

exports.deleteBrandCategory = catchAsync(async(req, res, next) => {
    const { category_id, brand_id } = req.query;
    const brand = await Brands.findOne({ where: { brand_id } });
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));
    const category = await Categories.findOne({
        where: { category_id },
    });
    if (!category)
        return next(new AppError('Category did not found with category_id', 404));

    await Categoriesbrands.destroy({
        where: {
            [Op.and]: [{ brandId: brand.id }, { categoryId: category.id }]
        },
    });
    return res.status(200).send('Successfully Deleted');
});
exports.uploadBrandImage = catchAsync(async(req, res, next) => {
    const brand_id = req.params.id;
    const updatedBrand = await Brands.findOne({ where: { brand_id } });
    req.files = Object.values(req.files)

    if (!updatedBrand)
        return next(new AppError('Brand did not found with that ID', 404));
    const image = `${brand_id}.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/${image}`);

    await updatedBrand.update({
        image,
    });
    return res.status(201).send(updatedBrand);
});
exports.getBrand = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: req.params.id }, include: { model: Categories, as: "brand_categories" } })
    if (!brand) return next(new AppError("Brand not found with that id", 404))
    return res.status(200).send(brand)
})
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};