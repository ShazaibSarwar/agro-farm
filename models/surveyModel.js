const mongoose = require("mongoose");
const validator = require("validator");



const surveySchema = mongoose.Schema({

    title: {
        type: String,
        required: [true, 'A survey must have a title'],
        trim: true,
        // maxlength: [40, 'A survey name must have less or equal then 40 characters'],
        // minlength: [10, 'A survey name must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Survey name must only contain characters']
      },
      description: {
        type: String,
        required: [true, 'A survey must have a description'],
        trim: true
      },
      amount: {
        type: Number,
        required: [true, 'A survey must have a amount'],
        trim: true
      },

      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Survey must belong to a user']
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      due_date : {
        type: Date,
        required:[true, 'A survey must have due date']
      },
     estimated_time : {
    type: String,
    required:[true, 'A survey must have estimation time']
     },
      usersCount: {
        type: Number,
        required: [true, 'A survey must have a users count ']
      },
      answersCount:{
          type: Number,
          default:0
      },
      users : {
          type: [String]
      },
      questions: {
        type: Array,
        required: [true, 'A survey must have questions']
      },

})

const Survey = mongoose.model("Survey", surveySchema);
module.exports = Survey;