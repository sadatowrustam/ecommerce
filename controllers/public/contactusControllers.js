const { sendEmail } = require('./../../utils/email');
const catchAsync = require('../../utils/catchAsync');

exports.sendMyMail = catchAsync(async (req, res) => {
  await sendEmail(req.body);

  res.status(200).json({
    msg: 'Sizin hatynyz kabul edildi',
  });
});
