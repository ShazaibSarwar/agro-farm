const express = require("express");
const authController = require("../controllers/authController");
const adsController = require("../controllers/adsController");
const { get } = require("mongoose");

const router = express.Router();

router.use(authController.protect);

// router.route("/survey/:id").post(surveyController.submitSurvey);

// router.route("/user/:id").get(surveyController.getSurveysByUserId);

router
  .route("/")
  .get(adsController.getAllAds)
  .post(
    adsController.uploadTourImages,
    adsController.resizeTourImages,
    adsController.createAds
  );

router
  .route("/:id")
  .get(adsController.getOneAdd)
  .put(adsController.updateAddByID)
  .patch(adsController.updateAdStatus)
  .delete(adsController.deleteAddByID);

module.exports = router;
