const express = require('express')
const userController = require('../userControllers/userController')
const CONSTANT = require('../../../constant')
const rn = require('random-number')
const multer = require('multer');



const storage = multer.diskStorage({
  destination: process.cwd() + "/public/uploads/",
  filename: function (req, file, cb) {

    cb(
      null,
      "img_" +
      rn({
        min: 1001,
        max: 9999,
        integer: true
      }) +
      "_" +
      Date.now() +
      ".jpeg"
    );
  }
});
const upload = multer({ storage: storage })

let userRoute = express.Router()


// Save Details of user
userRoute.route('/register')
  .post((req, res) => {
    userController.signUp(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUESTATUS,
        data: result,
        message: result.message,

      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
    })

  })


//Complete user

userRoute.route('/completeProfile')
  .patch(upload.fields([{ name: 'profilePhoto', maxCount: 6 }]), (req, res) => {

    userController.completeProfile(req.body, req.files).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.SIGNUPSUCCESS,
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
    })
  })
// User Login Email Password
userRoute.route('/login')
  .post((req, res) => {

    userController.login(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result

      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, status: CONSTANT.FALSESTATUS })
    })
  })



//Verify and send activation Mail to user 
userRoute.route('/verifyEmail')
  .post((req, res) => {
    userController.verifyEmail(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.VERFIEDTRUE
      })
    }).catch(err => {
      return res.json({ message: err, success: CONSTANT.FALSE })

    })
  })

//Resend verification mail incase it failed 
userRoute.route('/resendVerification')
  .patch((req, res) => {
    userController.resendVerification(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.VERIFYMAIL
      })
    }).catch(err => {
      console.log(err);

      return res.json({ message: err, success: CONSTANT.FALSE })

    })
  })

userRoute.route('/completeRegistration')
  .patch((req, res) => {
    userController.completeRegistration(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.SIGNUPSUCCESS
      })
    }).catch(err => {
      console.log(err);

      return res.json({ message: err, success: CONSTANT.FALSE })

    })
  })

// Get list of service List
userRoute.route('/servicesList')
  .post((req, res) => {
    userController.servicesList(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Get list of particular service Provider
userRoute.route('/servicesList/:_id')
  .get((req, res) => {
    userController.displayProfile(req.params._id).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Create Booking
userRoute.route('/createBooking')
  .post((req, res) => {
    userController.createBooking(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.BOOKSUCCESSFULL
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Get request List
userRoute.route('/getRequestList')
  .post((req, res) => {
    userController.getRequestList(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//add Favourites
userRoute.route('/addFavourites')
  .patch((req, res) => {
    userController.addFavourites(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ADDMSG
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })


// Show Favourites List
userRoute.route('/showFavourites/:_id')
  .get((req, res) => {
    userController.showFavourites(req.params._id).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result

      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Remove Favourites
userRoute.route('/removeFavourites/:serviceId')
  .delete((req, res) => {
    userController.removeFavourites(req.params.serviceId).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        message: CONSTANT.REMOVEFAV
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Provide Ratings to service
userRoute.route('/provideServiceRatings')
  .patch((req, res) => {
    userController.provideServiceRatings(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        message: CONSTANT.UPDATEMSG
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

userRoute.route('/changePassword').
  patch((req, res) => {
    userController.changePassword(req.body).then(result => {
      return res.json({

        success: CONSTANT.TRUE,
        message: CONSTANT.UPDATEMSG,
        data: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, status: CONSTANT.FALSESTATUS })
    })
  })

//Add issue by service
userRoute.route('/addIssue')
  .post(upload.fields([{ name: 'issueimage', maxCount: 1 }]), (req, res) => {
    userController.addIssue(req.body, req.files).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ISSUESUCCESSFULLY
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//get Nearby Cars
userRoute.route('/getNearbyCars')
  .post((req, res) => {
    userController.getNearbyCars(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ISSUESUCCESSFULLY
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })
// userController.cronJob()

module.exports = userRoute;