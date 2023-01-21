const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/sign-in/google", authController.googleSignIn);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
// router.patch('/verify',authController.protect, userController.updateStatus);
// router.get('/user/:id/stats',authController.protect, userController.getStats);
router.route("/getAllExperts").get(userController.getAllExperts)

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
    .route("/search-user")
    .get(authController.protect, userController.searchUser);

router
  .route("/experts")
  .get(userController.getAllExpertsData)


router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUserByID)
  .delete(userController.deleteUser);


router.patch("/resetPassword/:token", authController.resetPassword);

router
  .route("/experts/:id")
  .get(userController.getSingleExpert)
  .delete(userController.deleteExpert)
  .patch(userController.updateExpertByID)


module.exports = router;
