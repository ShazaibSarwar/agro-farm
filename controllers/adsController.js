const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Survey = require("../models/surveyModel");
const User = require("../models/userModel");
const Ads = require("../models/adsModel");
const multer = require("multer");
const sharp = require("sharp");
const APIFeatures = require("../utils/apiFeatures");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `ads-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/ads/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `ads-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/ads/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createAds = catchAsync(async (req, res, next) => {
  let { user: userId } = req.body;

  let user = await User.findById(userId);

  if (!user) {
    return next(new AppError("Invalid user id", 400));
  }

  console.log(req.body);

  let doc = await Ads.create(req.body);

  res.status(200).json({
    status: "Success",
    data: { ads: doc, message: "Ads created successfully" },
  });
});

exports.getAllAds = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Ads.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const ads = await features.query;
  res.status(200).json({
    status: "Success",
    count: ads.length,
    data: { ads },
  });
});

exports.updateAddByID = catchAsync(async (req, res, next) => {
  console.log(
    "--------------------------------- In Update Ad Fn ---------------------------------"
  );
  console.log(' Update add body ------------> ', req.body)

  if (isEmpty(req.body)) {
    console.log(' in If ------------>  Returned')
    return next(new AppError("Body cannot be Empty", 304));
  }

  let adsResponse = await Ads.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!adsResponse) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    data: { adsResponse },
  });
});



exports.deleteAddByID = catchAsync(async (req, res, next) => {
  console.log(
    "--------------------------------- In Delete Fn ---------------------------------"
  );
  console.log("res", res);
  const adsResponse = await Ads.findByIdAndDelete(req.params.id);

  if (!adsResponse) {
    return next(new AppError("No document found with that ID", 404));
  } else {
    res.status(204).json({
      status: "Deleted successfully",
      data: null,
    });
  }
});

exports.updateAdStatus = catchAsync(async (req, res, next) => {
  console.log(
    "--------------------------------- In Updaet Status Controller ---------------------------------"
  );

  console.log(' Update Status body ------------> ', req.body)
  let adsResponse = await Ads.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!adsResponse) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    data: { adsResponse },
  });
});


exports.getOneAdd = catchAsync(async (req, res, next) => {
  let adsResponse = await Ads.findById(req.params.id);
  if (!adsResponse) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: { adsResponse },
  });
});


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}