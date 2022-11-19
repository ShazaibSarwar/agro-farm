const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Survey = require("../models/surveyModel");
const User = require("../models/userModel");
const Survey_Answer = require("../models/surveyAnswersModel")
const APIFeatures = require("../utils/apiFeatures");

exports.createSurvey = catchAsync(async (req, res, next) => {
  let { questions, userId,estimated_time } = req.body;

  let user = await User.findById(userId);

  if (!questions ||  !estimated_time ) {
    return next(new AppError("Questions and Estimation time are mandatory", 400));
  }
  if (!user) {
    return next(new AppError("Invalid user id", 400));
  }

  let doc = await Survey.create(req.body);

  res.status(200).json({
    status: "Success",
    data: { survey: doc, message: "Survey created successfully" },
  });
});

exports.getAllSurveys = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Survey.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const surveys = await features.query;
  res.status(200).json({
    status: "Success",
    count: surveys.length,
    data: { surveys },
  });
});

exports.getSurveysByUserId = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("Invalid user id", 400));
  }
  const features = new APIFeatures(
    Survey.find({ userId: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const surveys = await features.query;
  res.status(200).json({
    status: "Success",
    count: surveys.length,
    data: { surveys },
  });
});

exports.updateSurvey = catchAsync(async (req, res, next) => {
  let survey = await Survey.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!survey) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    data: { survey },
  });
});

exports.deleteSurvey = catchAsync(async (req, res, next) => {
  const survey = await Survey.findByIdAndDelete(req.params.id);

  if (!survey) {
    return next(new AppError("No document found with that ID", 404));
  }
  let findAnwers = await Survey_Answer.deleteMany({surveyId:req.params.id})
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getSurvey = catchAsync(async (req, res, next) => {
  let survey = await Survey.findById(req.params.id);
  if (!survey) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: { survey },
  });
});

exports.submitSurvey = catchAsync(async (req, res, next) => {
  const {userId,createdBy,answers}    = req.body
  console.log(req.body)
  if (!userId ||  !createdBy ||  !answers) {
    return next(new AppError("Answer,created by and userId are mandatory", 400));
  }
  let survey = await Survey.findById(req.params.id);
  if (!survey) {
    return next(new AppError("No document found with that ID", 404));
  }
  if(survey.users.find((el)=>el == userId)){
    return next(new AppError("You already have taken survey", 200));
  }else {
    survey.users.push(userId)
  }

  let tempObj =  {answersCount :survey.answersCount +1, users : survey.users }

  if(tempObj.answersCount > survey.usersCount){
    return next(new AppError("Survey Limit has been exceeded", 200));
  }
  let newSurvey = await Survey.findByIdAndUpdate(req.params.id, tempObj, {
    new: true,
    runValidators: true,
  });
let amountEarned = newSurvey.amount / newSurvey.usersCount
  let doc = await Survey_Answer.create({...req.body,surveyId:req.params.id,amountEarned:Math.round(amountEarned)});

  res.status(200).json({
    status: "Success",
    data: { doc },
  });
});
