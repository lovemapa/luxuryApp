'use strict'
const ownerModel = require('../../../models/ownerModel')
const vehicleModel = require('../../../models/vehicleModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const rn = require('random-number')
const userModel = require('../../../models/userModel')
// const serviceIssue = require('../../../models/serviceIssueModel')

const moment = require('moment')

class owner {

    //Owner Signup
    signUp(data, files) {
        return new Promise((resolve, reject) => {
            console.log(data);

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

                console.log(verificationPhotos, data.profilePic);

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
                owner.save().then((result) => {
                    const vehicle = new vehicleModel({
                        ownerId: result._id,
                        date: moment().valueOf()

                    })
                    vehicle.save().then(veh => {
                        console.log(veh);

                    }).catch(err => {
                        console.log(err);

                    })
                    resolve(result)
                }).catch(error => {
                    console.log(error.code);

                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error.code === 11000)
                        return reject(CONSTANT.EXISTSMSG)
                    return reject(error)
                })
            }
        })
    }

    // Complete owner Profile
    completeProfile(data, file) {
        return new Promise((resolve, reject) => {
            if (!data.ownerId || !file) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                let query = {}
                file.profilePhoto.map(result => {
                    data.profilePic = '/' + result.filename

                });
                var currentCoordinates = []
                if (data.firstName)
                    query.firstName = data.firstName
                if (data.lastName)
                    query.lastName = data.lastName
                if (data.password)
                    data.password = commonFunctions.hashPassword(data.password)
                if (data.country)
                    query.country = data.country
                if (data.state)
                    query.state = data.state
                if (data.city)
                    query.city = data.city
                if (file)
                    query.profilePic = data.profilePic
                if (data.currentLat && data.currentLong) {
                    query.currentLat = data.currentLat
                    query.currentLong = data.currentLong
                    currentCoordinates.push(data.currentLong)
                    currentCoordinates.push(data.currentLat)
                    console.log(currentCoordinates);

                    query.currentCoordinates = currentCoordinates
                }
                ownerModel.findByIdAndUpdate({ _id: data.ownerId }, { $set: query }, { new: true }).then(update => {
                    resolve(update)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
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
            if (!data.contact) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                ownerModel.findOne({ contact: data.contact }).then(result => {
                    if (!result) {
                        reject(CONSTANT.NOTREGISTERED)
                    }
                    else {

                        resolve(result)
                    }

                })
            }

        })
    }


    forgotPassword(data) {
        return new Promise((resolve, reject) => {
            if (!data.email)
                reject('Kindly Provide Email')
            serviceModel.findOne({ email: data.email }).then(result => {
                if (!result) {
                    reject(CONSTANT.NOTREGISTERED)
                }
                else {
                    const token = Math.floor(Math.random() * 10000)
                    serviceModel.findOneAndUpdate({ email: data.email }, { $set: { token: token } }).then(updateToken => {
                    })
                    commonController.sendMail(data.email, result._id, token, (result) => {
                        if (result.status === 1)
                            resolve(CONSTANT.VERIFYMAIL)

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
            serviceModel.findById(query.user).then(
                result => {

                    if (result && result.token == query.token) {

                        serviceModel
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
                            ).catch(error => {
                                if (error.errors)
                                    return reject(commonController.handleValidation(error))

                                return reject(error)
                            })
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