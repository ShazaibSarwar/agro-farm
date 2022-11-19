const mongoose = require("mongoose");
const validator = require("validator");



const answerSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User is required field']
    },
    surveyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Survey',
        required: [true, 'Survey Id is required field']
    },
    answers:{
        type:Object,
        required: [true, 'Answers  is required field']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required field']
    },
    amountEarned:{
        type:Number,
    }
})

const Survey_Answer = mongoose.model("Survey_Answer", answerSchema);
module.exports = Survey_Answer;