'use strict'
const ownerModel = require('../../../models/ownerModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const vehicleSchema = require('../../../models/vehicleImageModel')
const ownerVerfiySchema = require('../../../models/ownerImagesModel')
const rn = require('random-number')
const userModel = require('../../../models/userModel')
const vehicleModel = require('../../../models/vehicleModel')
const geolib = require('geolib');
const moment = require('moment')

class owner {

    //Owner Signup

    signUp(data, files) {
        return new Promise((resolve, reject) => {

            if (!data.email || !data.password) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                const token = rn({
                    min: 1001,
                    max: 9999,
                    integer: true
                })
                files.profilePic.map(result => {
                    data.profilePic = '/' + result.filename

                });
                var verificationPhotos = []
                files.verificationPhotos.map(result => {
                    verificationPhotos.push('/' + result.filename);

                });
                data.verificationPhotos = verificationPhotos
                data.token = token



                const owner = new ownerModel({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    profilePic: data.profilePic,
                    verificationPhotos: data.verificationPhotos,
                    password: commonFunctions.hashPassword(data.password),
                    token: token,
                    date: moment().valueOf()
                })
                owner.save().then((saveresult) => {
                    resolve({ message: CONSTANT.VERIFYMAIL, result: saveresult })
                    commonController.sendMailandVerify(saveresult.email, saveresult._id, token, 'owner', result => {
                        if (result.status === 1)
                            console.log(result.message.response);
                        else
                            reject(result.message)
                    })
                }).catch(error => {
                    console.log(error);

                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error.code === 11000)
                        return reject(CONSTANT.EXISTSMSG)
                    return reject(error)
                })
            }
        })
    }


    verify(query) {
        return new Promise((resolve, reject) => {
            if (!query.user)
                reject(CONSTANT.MISSINGPARAMS)

            else {
                ownerModel.findById(query.user).then(result => {
                    if (result.token == query.token) {
                        ownerModel.findByIdAndUpdate(query.user, { $set: { isVerified: true, } }, { new: true }).then(result => {
                            if (result) {

                                resolve(result)

                            }
                            else
                                reject(CONSTANT.NOTREGISTERED)
                        })
                            .catch(error => {
                                if (error.errors)
                                    return reject(commonController.handleValidation(error))
                                if (error)
                                    return reject(error)
                            })
                    }
                    else {
                        reject("UNAUTHORIZED")
                    }
                })

            }

        })
    }


    resendVerification(data) {
        return new Promise((resolve, reject) => {
            if (!data.email)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                const token = rn({
                    min: 1001,
                    max: 9999,
                    integer: true
                })
                ownerModel.findOneAndUpdate({ email: data.email }, { $set: { token: token } }, { new: true }).then(updateResult => {
                    if (updateResult == null)
                        reject(CONSTANT.NOTREGISTERED)
                    resolve(updateResult)
                    commonController.sendMailandVerify(data.email, updateResult._id, token, 'owner', result => {
                        if (result.status === 1)
                            console.log(result.message.response);

                        else
                            reject(CONSTANT.SOMETHINGWRONG)
                    })
                })
            }
        })


    }
    //Add Vehicle
    addVehicle(data, files) {
        return new Promise((resolve, reject) => {

            var currentCoordinates = []
            var location = {}
            if (data.currentLat && data.currentLong) {
                currentCoordinates.push(Number(data.currentLong))
                currentCoordinates.push(Number(data.currentLat))
                location.type = "Point";
                location.coordinates = currentCoordinates
            }

            const vehicle = new vehicleModel({
                ownerId: data.ownerId,
                aboutCar: data.aboutCar,
                vehicleType: data.vehicleType,
                vehicleModel: data.vehicleModel,
                color: data.color,
                chassis: data.chassis,
                condition: data.condition,
                engine: data.engine,
                makeOfCar: data.makeOfCar,
                carName: data.carName,
                hourlyRate: data.hourlyRate,
                dayRate: data.dayRate,
                currentLat: Number(data.currentLat),
                currentLong: Number(data.currentLong),
                location: location,
                date: moment().valueOf()

            })
            vehicle.save().then(vehicle => {
                if (files)
                    files.vehiclePics.map(result => {
                        const vehiclePics = new vehicleSchema({
                            path: '/' + result.filename,
                            vehcileId: vehicle._id,
                            date: moment().valueOf()
                        })
                        vehiclePics.save().then(image => {

                        })
                    })
                resolve(vehicle)

            }).catch(err => {
                console.log(err);

            })
        })
    }

    // display Vehicles list to owner 

    displayVehicles(_id) {
        return new Promise((resolve, reject) => {

            if (!_id)
                reject(CONSTANT.OWNERIDMISSING)
            vehicleModel.find({ ownerId: _id }).select(' vehicleType hourlyRate').populate("vehicleImages").then(result => {
                console.log(_id);

                if (!result) {
                    reject(CONSTANT.NOTREGISTERED)
                }
                else {

                    resolve(result)
                }

            }).catch(err => {
                if (err.errors)
                    return reject(commonController.handleValidation(error))
            })


        })
    }
    // Complete owner Profile
    completeProfile(data, file) {
        return new Promise((resolve, reject) => {
            if (!data.ownerId || !file) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                if (file) {
                    file.verificationPhotos.map(result => {
                        const imagesPics = new ownerVerfiySchema({
                            path: '/' + result.filename,
                            ownerId: data.ownerId,
                            date: moment().valueOf()
                        })
                        imagesPics.save().then(image => {
                            resolve(image)
                        }).catch(error => {
                            if (error.errors)
                                return reject(commonController.handleValidation(error))

                            return reject(error)
                        })
                    })
                }

            }
        })
    }



    updateVehicle(data, files) {
        return new Promise((resolve, reject) => {
            if (!data.ownerId || !files) {
                reject(CONSTANT.MISSINGPARAMSORFILES)
            }
            else {
                var vehiclePics = []
                files.vehiclePics.map(result => {
                    vehiclePics.push('/' + result.filename);

                });
                let query = {}
                if (files)
                    query.vehiclePics = vehiclePics
                if (data.vehicleType)
                    query.vehicleType = data.vehicleType
                if (data.vehicleModel)
                    query.vehicleModel = data.vehicleModel
                if (data.color)
                    query.color = data.color
                if (data.chassis)
                    query.chassis = data.chassis
                if (data.engine)
                    query.engine = data.engine
                if (data.condition)
                    query.condition = data.condition
                if (data.makeOfCar)
                    query.makeOfCar = data.makeOfCar

                if (data.hourlyRate)
                    query.hourlyRate = data.hourlyRate


                vehicleModel.findOneAndUpdate({ ownerId: data.ownerId }, { $set: query }, { new: true }).then(update => {
                    resolve(update)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }


    // Owner Login
    login(data) {
        return new Promise((resolve, reject) => {
            if (!data.email || !data.password) {
                reject(CONSTANT.MISSINGPARAMS)
            }

            else {
                ownerModel.findOne({ email: data.email }).then(result => {
                    if (!result) {
                        reject(CONSTANT.NOTREGISTERED)
                    }
                    else {
                        if (commonFunctions.compareHash(data.password, result.password) && result.isAdminVerified) {
                            resolve(result)
                        }
                        else {
                            console.log(result);

                            if (!result.isAdminVerified)
                                reject(CONSTANT.NOTADMINVERIFIED)
                            else
                                reject(CONSTANT.WRONGCREDENTIALS)
                        }
                    }
                })
            }

        })
    }


    forgotPassword(data) {
        return new Promise((resolve, reject) => {
            console.log(data);

            if (!data.email)
                reject('Kindly Provide Email')
            ownerModel.findOne({ email: data.email }).then(result => {
                if (!result) {
                    reject(CONSTANT.NOTREGISTERED)
                }
                else {
                    const token = rn({
                        min: 1001,
                        max: 9999,
                        integer: true
                    })
                    ownerModel.findOneAndUpdate({ email: data.email }, { $set: { token: token } }).then(updateToken => {
                        resolve(CONSTANT.VERIFYMAIL)
                    })
                    commonController.sendMail(data.email, result._id, token, 'owner', (result) => {

                        if (result.status === 1)
                            console.log(result.message.response);

                        else
                            reject(result.message)
                    })

                }
            })

        })
    }

    forgetPasswordVerify(body, query) {
        return new Promise((resolve, reject) => {

            if (body.confirmpassword != body.password)
                return reject("Password and confirm password not matched.")
            ownerModel.findById(query.user).then(
                result => {

                    if (result && result.token == query.token) {

                        userModel
                            .findByIdAndUpdate(query.user, {
                                password: commonFunctions.hashPassword(body.password),
                                token: ""
                            })
                            .then(
                                result1 => {
                                    return resolve('Password changed successfully.')
                                },
                                err => {
                                    return reject(err)
                                }
                            )
                    }
                    else {
                        return reject({ expired: 1 })
                    }
                },
                err => {
                    return reject(err)
                }
            )
        })
    }
    addPhotos(data, files) {
        return new Promise((resolve, reject) => {
            var photos = []
            if ((!data._id && !files) || Object.keys(files).length === 0)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                files.photos.map(result => {
                    photos.push('/' + result.filename);

                });

                serviceModel.updateOne({ _id: data._id }, { $addToSet: { photos: photos } }).then(photos => {
                    if (photos.nModified === 1)
                        resolve(CONSTANT.ADDSUCCESS)
                    else
                        reject(CONSTANT.ADDFAIL)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }

    addVerificationPhotos(data, files) {
        return new Promise((resolve, reject) => {

            var verificationPhotos = []
            if ((!data._id && !files) || Object.keys(files).length === 0)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                files.verificationPhotos.map(result => {
                    verificationPhotos.push('/' + result.filename);

                });
                serviceModel.updateOne({ _id: data._id }, { $addToSet: { verificationPhotos: verificationPhotos } }).then(photos => {
                    if (photos.nModified === 1)
                        resolve(CONSTANT.ADDSUCCESS)
                    else
                        reject(CONSTANT.ADDFAIL)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }

    acceptDenyRequest(data) {
        return new Promise((resolve, reject) => {
            if (!data.bookingId || !data.response)
                reject(CONSTANT.MISSINGPARAMS)
            var status
            if (data.response == 'accept')
                status = 'confirmed'
            else
                status = 'closed'
            console.log(data);

            bookingModel.findByIdAndUpdate({ _id: data.bookingId }, { $set: { status: status } }, { new: true }).then(update => {
                if (update)
                    resolve(update)
                else
                    reject(CONSTANT.SOMETHINGWRONG)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))

                return reject(error)
            })
        })
    }

    getRequestList(data) {
        return new Promise(async (resolve, reject) => {
            if (!data.serviceId)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                var query = {}
                if (data.bookingId) {
                    query.serviceId = data.serviceId;
                    query._id = data.bookingId;
                    query.status = { $ne: "closed" }
                }
                else {
                    query.serviceId = data.serviceId;
                    query.status = { $ne: "closed" }
                }
                console.log(query);

                var requests = []
                var bookings = []
                var userId = []
                bookingModel.find(query).populate({ path: 'userId', select: '_id ratings nickName', populate: { path: 'allRatings ', select: 'userRatings' } }).then(result => {

                    result.map(category => {
                        if (category.status == 'pending')
                            requests.push(category)
                        else
                            bookings.push(category)
                    })

                    resolve({ requests: requests, bookings: bookings })
                })
                    .catch(error => {
                        if (error.errors)
                            return reject(commonController.handleValidation(error))
                        if (error)
                            return reject(error)
                    })
            }
        })
    }

    changePassword(data) {
        return new Promise((resolve, reject) => {
            console.log(data);

            if (!data.oldPassword || !data.newPassword || !data.confirmPassword || !data._id)
                reject(CONSTANT.MISSINGPARAMS)
            if (data.confirmPassword != data.confirmPassword)
                reject(CONSTANT.NOTSAMEPASSWORDS)
            else {
                serviceModel.findOne({ _id: data._id }).then(oldPass => {

                    if (commonFunctions.compareHash(data.oldPassword, oldPass.password)) {
                        serviceModel.findByIdAndUpdate({ _id: data._id }, { $set: { password: commonFunctions.hashPassword(data.newPassword) } }, { new: true }).then(update => {
                            resolve(update)
                        })
                    }
                    else {
                        reject(CONSTANT.WRONGOLDPASS)
                    }
                    resolve(oldPass)
                })
                    .catch(error => {
                        if (error.errors)
                            return reject(commonController.handleValidation(error))
                        if (error)
                            return reject(error)
                    })
            }
        })
    }

    updateService(data) {
        return new Promise((resolve, reject) => {
            console.log(data);

            if (!data.serviceId)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                var query = {}
                var measurments = []
                if (data.cupSize && data.waistSize && data.hipSize) {
                    measurments.push(data.cupSize)
                    measurments.push(data.waistSize)
                    measurments.push(data.hipSize)
                    query.measurments = measurments
                }
                if (data.languages)
                    query.languages = data.languages
                if (data.age)
                    query.age = data.age
                if (data.maritalStatus)
                    query.maritalStatus = data.maritalStatus
                if (data.gender)
                    query.gender = data.gender
                if (data.height)
                    query.height = data.height
                if (data.bodyType)
                    query.bodyType = data.bodyType
                if (data.eyesColor)
                    query.eyesColor = data.eyesColor

                serviceModel.findByIdAndUpdate({ _id: data.serviceId }, { $set: query }, { new: true }).then(update => {
                    resolve(update)


                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error)
                        return reject(error)
                })

            }
        })
    }
    setStatus(data) {
        return new Promise((resolve, reject) => {
            console.log(data);

            if (!data._id || !data.status)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                serviceModel.findByIdAndUpdate({ _id: data._id }, { $set: { status: parseInt(data.status) } }, { new: true }).then(updateStatus => {

                    console.log(updateStatus);
                    resolve(updateStatus)
                })
                    .catch(error => {
                        if (error.errors)
                            return reject(commonController.handleValidation(error))
                        if (error)
                            return reject(error)
                    })
            }
        })
    }

    provideUserRatings(data) {
        return new Promise((resolve, reject) => {
            if (!data.bookingId)
                reject(CONSTANT.MISSINGPARAMS)
            else {

                bookingModel.findByIdAndUpdate({ _id: data.bookingId }, { $set: { userRatings: data.ratings, status: "closed" } }).then(result => {
                    resolve(result)
                })
                    .catch(error => {
                        if (error.errors)
                            return reject(commonController.handleValidation(error))
                        if (error)
                            return reject(error)
                    })
            }
        })
    }

    addIssue(data, file) {
        console.log(file);

        return new Promise((resolve, reject) => {
            if (!data.serviceId || !data.issue || !file || Object.keys(file).length === 0)
                reject(CONSTANT.MISSINGPARAMS)
            else {

                file.issueimage.map(result => {
                    data.screenshot = '/' + result.filename

                });
                const issue = this.createIssueService(data)
                issue.save({}).then(result => {
                    resolve(result)
                })
                    .catch(error => {
                        if (error.errors)
                            return reject(commonController.handleValidation(error))
                        if (error)
                            return reject(error)
                    })
            }
        })
    }

    createIssueService(data) {
        let issueData = new serviceIssue({
            serviceId: data.serviceId,
            screenshot: data.screenshot,
            issue: data.issue
        })
        return issueData
    }

}
module.exports = new owner();