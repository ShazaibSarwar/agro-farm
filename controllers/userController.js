const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Survey = require("../models/surveyModel");
const multer = require('multer');
const sharp = require('sharp');
const User = require("../models/userModel");
const Survey_Answer = require("../models/surveyAnswersModel")

// const multerStorage = multer.diskStorage({
//   destination:(req,file,cb) =>{
//     cb(null,'public/img/users')
//   },
//   filename:(req,file,cb) =>{
//     const ext = file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb) =>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new AppError('Not an image! Please upload only images.',400),false)
  }
}

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});
exports.uploadUserPhoto =upload.single('photo')

exports.resizeUserPhoto = (req,res,next)=>{
  if(!req.file) return next()
     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
  sharp(req.file.buffer)
      .resize(500,500)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`public/img/users/${req.file.filename}`)
        next()
}

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};



exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body)
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }



  const filteredBody = filterObj(req.body, 'name', 'email','lastname');
   if(req.file) filteredBody.photo = req.file.filename

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.updateStatus =  catchAsync( async(req,res,next) => {
  const {is_verified,userId} = req.body
  console.log(req.body)
  if(!userId){
    return next(
        new AppError(
            "is_verified and userId is required",
            400
        )
    );
  }
  let tempObj = {is_verified:is_verified}
  const user  = await User.findByIdAndUpdate(userId,tempObj,{
    new: true,
    runValidators: false
  })
  if(!user){
    return next(
        new AppError(
            "User not found",
            404
        )
    );
  }
  res.status(200).json({
    status: 'success',
    statusCode:200,
    data: {
      user: user
    }
  });

});

exports.getStats =  catchAsync( async(req,res,next) => {
    const  userId  = req.params.id
  const user  = await User.findById(userId)
  if(!user){
    return next(
        new AppError(
            "User not found",
            404
        )
    );
  }

let surveyCreated = await Survey.countDocuments({userId:req.params.id})
  let surveyTaken = await Survey_Answer.countDocuments({userId:req.params.id})
  let surveyAnwers = await Survey_Answer.find({userId:req.params.id})
  let moneyEarned = surveyAnwers.reduce((a, b) => a + Number(b.amountEarned), 0)
 let surveys =   await Survey.find({userId:req.params.id})
  let moneySpent = surveys.reduce((a, b) => a + Number(b.amount), 0)

console.log(moneySpent)

  res.status(200).json({
    status: 'success',
    statusCode:200,
    data: {
      surveyCreated,
      surveyTaken,
      moneySpent,
      moneyEarned
    }
  });

});



exports.getAllUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
