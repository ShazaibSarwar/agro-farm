const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");
const User = require("../models/userModel");

exports.contact = catchAsync(async (req, res, next) => {
    const { name,email,message} = req.body;
           let resetUrl = 'ddddddddddd'
    let user ={name,email,message}
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
        message: "Email sent",

    });
});
