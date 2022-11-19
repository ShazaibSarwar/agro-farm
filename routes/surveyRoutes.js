const express = require('express');
const authController = require('../controllers/authController');
const surveyController = require('../controllers/surveyController');

const router = express.Router();



router.use(authController.protect);

router
    .route('/survey/:id')
    .post(
        surveyController.submitSurvey
    );


router
  .route('/user/:id')
  .get(
    surveyController.getSurveysByUserId
  );

router
  .route('/')
  .get(surveyController.getAllSurveys)
  .post(
    surveyController.createSurvey
  );

router
  .route('/:id')
  .get(surveyController.getSurvey)
  .patch(
    surveyController.updateSurvey
  )
  .delete(
    surveyController.deleteSurvey
  );


  module.exports = router;