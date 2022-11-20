const express = require("express");
const authController = require("../controllers/authController");
const adsController = require("../controllers/adsController");

const router = express.Router();

// router.use(authController.protect);

// router.route("/survey/:id").post(surveyController.submitSurvey);

// router.route("/user/:id").get(surveyController.getSurveysByUserId);



router
  .route("/")
  .get(adsController.getAllAds)
  .post(
    authController.protect,
    adsController.uploadTourImages,
    adsController.resizeTourImages,
    adsController.createAds
  );

router
  .route("/update/:id")
  .patch(authController.protect, adsController.updateAddByID)


router
  .route("/:id")
  .get(authController.protect, adsController.getOneAdd)
  .patch(authController.protect, adsController.updateAdStatus)
  .delete(authController.protect, adsController.deleteAddByID);



module.exports = router;