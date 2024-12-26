const express = require('express');
const router = express.Router();
const {logout, VerifyUser, CheckUser, ActivateAccount, SignIn, ForgetPassword, ResetPassword, CheckAdmin, CheckCustomer } = require('../Controllers/User');

router.post('/verify_user',CheckUser, VerifyUser);
router.post('/verify_admin',CheckAdmin, VerifyUser);
router.post('/verify_customer',CheckCustomer, VerifyUser);
router.post('/signin', SignIn);
router.post('/activate_account', ActivateAccount)
router.post('/forget_password', ForgetPassword)
router.post('/reset_password', ResetPassword)
router.post('/logout', logout)

module.exports = router;

