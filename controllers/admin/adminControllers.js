const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Admin } = require('../../models');

const signToken = (id) => {

    return jwt.sign({ id }, 'rustam', {
        expiresIn: '24h',
    });
};

const createSendToken = (admin, statusCode, res) => {
    const token = signToken(admin.id);
    res.status(statusCode).json({
        token,
        data: {
            admin,
        },
    });
};

exports.login = catchAsync(async(req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        return next(new AppError('Please provide username and  password', 400));
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return next(new AppError('Incorrect username or password', 401));
    }

    createSendToken(admin, 200, res);
});

exports.protect = catchAsync(async(req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged as an Admin!.', 401));
    }

    const decoded = await jwt.verify(token, 'rustam');


    const freshAdmin = await Admin.findOne({ where: { id: decoded.id } });

    if (!freshAdmin) {
        return next(
            new AppError('The user belonging to this token is no longer exists', 401)
        );
    }

    req.admin = freshAdmin;
    next();
});
exports.sendMe = catchAsync(async(req, res, next) => {
    return res.status(200).send(req.admin)
})
exports.updateMe = catchAsync(async(req, res, next) => {
    const { username, password, newPassword, newPasswordConfirm } = req.body;

    if (!username) {
        return next(new AppError('Please provide username and  password', 400));
    }

    const admin = await Admin.findOne();

    if (password && newPassword) {
        if (!(await bcrypt.compare(password, admin.password))) {
            return next(new AppError('Your current password is not correct', 401));
        }

        if (newPassword !== newPasswordConfirm) {
            return next(new AppError('New passwords are not the same', 400));
        }

        admin.update({
            password: await bcrypt.hash(newPassword, 12),
        });
    }

    admin.update({
        username,
    });

    createSendToken(admin, 200, res);
});