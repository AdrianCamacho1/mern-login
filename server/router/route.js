import { Router } from "express";
const router = Router();




/** POST METHODS */
router.route('/register').post((req, res) => res.json('register route'))
router.route('/registerMail').post(); //send the email
router.route('/authenticate').post(); // authenticate user
router.route('/login').post(); // login in app

/** GET METHODS */
router.route('/user/:username').get() // user with username
router.route('/generateOTP').get() // generate random OTP
router.route('/verifyOTP').get() // verify generated OTP
router.route('/createResetSession').get() // reset all the variables


/** PUT METHODS */
router.route('/updateuser').put(); // is used to update user profile
router.route('/resetPassword').put(); // use to reset password


export default router;