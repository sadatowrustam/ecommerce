const express = require('express');
var cors = require('cors');
const AppError = require('./utils/appError');
const app = express();
const fileUpload = require("express-fileupload")
const { sequelize } = require("./models");
const limiter = require('express-rate-limit')({
    max: 1000,
    windowMs: 1000,
    message: 'Too many requests from this IP, please try again in an hour',
});
app.use(
    cors({
        origin: '*',
        'Cross-Origin-Resource-Policy:': 'same-site',
        'Cross-Origin-Resource-Policy': 'cross-origin'
    })
);
app.use(require('morgan')('dev'));
app.use('/', limiter)
app.use(fileUpload())
    // app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "50mb" }))
app.use(express.static(`${__dirname}/static`));
app.use('/admin', require('./routes/admin/adminRouter'));
app.use('/public', require('./routes/public/publicRouter'));
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(require('./controllers/errorController'));
app.use(require('./controllers/dateController'))
const PORT = 5002;
const server = app.listen(PORT, async() => {
    await sequelize.authenticate();
    console.log(`Connected to DB and listening on port ${PORT}...`);
});
const socket = require("socket.io")(server, { cors: { origin: "*" } })
app.use(require("./controllers/chatControllers")(socket))
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});