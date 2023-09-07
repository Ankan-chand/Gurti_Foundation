const express = require('express');
const { registerUser, userLogin, userLogout, promoteAdmin, forgotPassword, resetPassword } = require('../controller/user');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(userLogin);
router.route('/logout').get(userLogout);
router.route('/promote/admin').post(isAuthenticated, promoteAdmin);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

module.exports = router;