const express = require('express'); 
const router = express.Router(); 
const authController = require('../controllers/userController'); 
const authToken = require('../middleware/authToken'); 
// Routes for user actions
router.post('/register', authController.register); // Route for user registration
router.post('/login', authController.login); // Route for user login
router.get('/logout', authController.logout); // Route for user logout
router.get('/profile', authToken, authController.getProfile); // Route for user profile with authentication middleware

router.post('/forgotPassword', authController.forgotPassword); // Send reset password link to the
router.put('/passwordReset/:token', authController.passwordReset); // Send reset password request with new password

module.exports = router; // Exporting the router
