const express      = require("express");
const router       = express.Router();
const upload       = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/authController");

// Public routes - no middleware
router.post("/create-admin",  authController.createAdmin);
router.post("/register",      authController.register);
router.post("/login",         authController.login);

// Protected routes
router.get("/me",             authMiddleware.protect, authController.getMe);
router.get("/pending",        authMiddleware.protect, authMiddleware.adminOnly, authController.getPendingUsers);
router.put("/approve/:id",    authMiddleware.protect, authMiddleware.adminOnly, authController.approveUser);
router.put("/update-image",   authMiddleware.protect, upload.single("image"),   authController.updateImage);
router.put("/change-password",authMiddleware.protect, authController.changePassword);

module.exports = router;