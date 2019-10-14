const express = require('express')
const ownerController = require('../ownerControllers/ownerControllers')
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

let ownerRoute = express.Router()


//Owner Register

ownerRoute.route('/signup')
    .post(upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'verificationPhotos', maxCount: 6 }]), (req, res) => {
        ownerController.signUp(req.body, req.files).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.SIGNUPSUCCESS,

            })
        }).catch(error => {

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })
    })


//Complete Owner

ownerRoute.route('/completeProfile')
    .patch(upload.fields([{ name: 'profilePhoto', maxCount: 6 }]), (req, res) => {

        ownerController.completeProfile(req.body, req.files).then(result => {
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

ownerRoute.route('/updateVehicle')
    .put(upload.fields([{ name: 'vehiclePics', maxCount: 6 }]), (req, res) => {

        ownerController.updateVehicle(req.body, req.files).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.UPDATEMSG,
            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })
    })

// Owner Login

ownerRoute.route('/login')
    .post((req, res) => {

        ownerController.login(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result

            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })


// Set Status Online /Offline

ownerRoute.route('/setStatus')
    .patch((req, res) => {

        ownerController.setStatus(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.UPDATEMSG

            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })
//Add Photos
ownerRoute.route('/addPhotos').
    patch(upload.fields([{ name: 'photos', maxCount: 10 }]), (req, res) => {
        ownerController.addPhotos(req.body, req.files).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                message: CONSTANT.ADDSUCCESS
            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })

//Add Verification Photo
ownerRoute.route('/addVerificationPhotos').
    patch(upload.fields([{ name: 'verificationPhotos', maxCount: 10 }]), (req, res) => {
        ownerController.addVerificationPhotos(req.body, req.files).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                message: CONSTANT.ADDSUCCESS
            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })

// Accept Request

ownerRoute.route('/acceptDenyRequest').
    patch((req, res) => {
        ownerController.acceptDenyRequest(req.body).then(result => {
            var message
            if (result.status == 'confirmed')
                message = CONSTANT.ACCEPTREQUEST
            else
                message = CONSTANT.REQUESTDECLINE
            return res.json({

                success: CONSTANT.TRUE,
                message: message,
                data: result
            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })

// Change Password

ownerRoute.route('/changePassword').
    patch((req, res) => {
        ownerController.changePassword(req.body).then(result => {
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


//update Service Details
ownerRoute.route('/updateService').
    patch((req, res) => {
        ownerController.updateService(req.body).then(result => {
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


//Get request List
ownerRoute.route('/getRequestList')
    .post((req, res) => {
        ownerController.getRequestList(req.body).then(result => {
            return res.send({
                success: CONSTANT.TRUE,
                data: result
            })
        }).catch(err => {
            console.log(err);
            return res.json({ message: err, success: CONSTANT.FALSE })
        })
    })

//Provide Ratings to User
ownerRoute.route('/provideUserRatings')
    .patch((req, res) => {
        ownerController.provideUserRatings(req.body).then(result => {
            return res.send({
                success: CONSTANT.TRUE,
                message: CONSTANT.UPDATEMSG
            })
        }).catch(err => {
            console.log(err);
            return res.json({ message: err, success: CONSTANT.FALSE })
        })
    })


//Add issue by service
ownerRoute.route('/addIssue')
    .post(upload.fields([{ name: 'issueimage', maxCount: 1 }]), (req, res) => {
        ownerController.addIssue(req.body, req.files).then(result => {
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
module.exports = ownerRoute;