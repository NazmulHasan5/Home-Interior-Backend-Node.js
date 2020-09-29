const router = require('express').Router();

const authController = require('../controllers/auth-Controller');

router.put("/signup",authController.putSignup)

router.put("/auth-user",authController.putAuthUser)

router.put("/resend-otp",authController.putResendOTP)

router.put("/login",authController.putLogin)

router.put("/validate-login-session",authController.putValidateLoginSession)

router.get("/profile",authController.putProfile)


module.exports = router;