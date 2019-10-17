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
                message: result.message,

            })
        }).catch(error => {

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })
    })

//VERFIFY
ownerRoute.route('/verify')
    .get((req, res) => {
        ownerController.verify(req.query).then(result => {

            return res.send(`<h1 style="text-align:center; font-size:100px" >Verified successfully</h1>`)
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })

    })


// Resend
ownerRoute.route('/resendVerification')
    .put((req, res) => {
        ownerController.resendVerification(req.body).then(result => {
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


ownerRoute.route('/forgetpassword').
    get((req, res) => {
        if (!(req.query.user || req.query.token)) {
            res.redirect('/server/app/views/404-page')
        }
        let message = req.flash('errm');
        console.log("messagev", message);

        res.render('forgetPassword', { title: 'Forget password', message })
    })



//Forgot Password

ownerRoute.route('/forget-password')
    .post((req, res) => {

        ownerController.forgotPassword(req.body).then(result => {
            return res.json({
                status: CONSTANT.TRUE,
                message: CONSTANT.CHANGEPASSWORDLINK

            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS })
        })
    })


// Verify Passowrd

ownerRoute.route('/forgetpassword').
    post((req, res) => {
        ownerController.forgetPasswordVerify(req.body, req.query).then(
            message => {
                res.render('forgetPassword', { message: message, title: 'Forget password' })
            },
            err => {
                if (err.expired) {
                    return res.send(`<h1 style="text-align:center; font-size:100px" >Forget password link has been expired.</h1>`)
                }
                req.flash('errm', err)

                let url = `/api/user/forgetpassword?token=${req.query.token}&user=${req.query.user}`
                res.redirect(url)
            }
        )
    })

//Add Vehicle

ownerRoute.route('/addVehicle')
    .post(upload.fields([{ name: 'vehiclePics', maxCount: 4 }, { name: 'verificationPhotos', maxCount: 6 }]), (req, res) => {
        ownerController.addVehicle(req.body, req.files).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.VEHCILEADDSUCEESS,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })
    })

//Add Vehicle

ownerRoute.route('/displayVehicles/:ownerId')
    .get((req, res) => {
        ownerController.displayVehicles(req.params.ownerId).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result
            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, status: CONSTANT.FALSESTATUS, success: CONSTANT.FALSE })
        })
    })
//Complete Owner

ownerRoute.route('/completeProfile')
    .put(upload.fields([{ name: 'verificationPhotos', maxCount: 6 }]), (req, res) => {

        ownerController.completeProfile(req.body, req.files).then(result => {
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