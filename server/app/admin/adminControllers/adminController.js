'use strict'
const adminModel = require('../../../models/adminModel')
const carCategory = require('../../../models/carCategoryModel')
const bookingModel = require('../../../models/bookingModel')
const ownerModel = require('../../../models/ownerModel')
const userModel = require('../../../models/userModel')
const CONSTANT = require('../../../constant')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const moment = require('moment')
const generate = require('csv-generate')
const assert = require('assert')
const mongoose = require('mongoose')
const { Parser } = require('json2csv');

const fs = require('fs')


class admin {

    signUp(data) {

        return new Promise((resolve, reject) => {

            if (!data.email || !data.password) {
                reject(CONSTANT.EMAILPASSWORDPARAMS)
            }
            else {
                const adminRegster = this.createAdmin(data)
                adminRegster.save().then((saveresult) => {
                    resolve(saveresult)

                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }
    // --------Create Admin Registration Model------------
    createAdmin(data) {

        data.password = commonFunctions.hashPassword(data.password)
        let adminRegistrationData = new adminModel({
            email: data.email,
            password: data.password,
            date: moment().valueOf()
        })
        return adminRegistrationData;
    }

    //===========================================================================================
    //Create User
    registerUser(data) {

        return new Promise((resolve, reject) => {
            console.log('data==', data);

            if (!data.email || !data.password) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            if (data.password != data.confirmPassword)
                reject(CONSTANT.NOTSAMEPASSWORDS)
            else {
                const userRegister = this.createUserRegistration(data)
                userRegister.save().then((saveresult) => {
                    resolve(saveresult)

                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error.code === 11000)
                        return reject(CONSTANT.UNIQUEEMAILANDUSERNAME)
                    return reject(error)
                })
            }
        })
    }

    // --------Create User Registration Model------------
    createUserRegistration(data) {

        data.password = commonFunctions.hashPassword(data.password)
        let userRegistrationData = new userModel({
            email: data.email,
            countryCode: data.countryCode,
            nickName: data.nickName,
            password: data.password,
            token: data.token,
            callType: data.callType,
            area: data.area,
            state: data.state,
            date: moment().valueOf(),
            isVerified: true,
            gender: data.gender,
            genderPreference: data.genderPreference,

        })
        return userRegistrationData;
    }

    //===========================================================================================
    // admin Login

    login(data) {
        return new Promise((resolve, reject) => {
            if (!data.password || !data.email) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                adminModel.findOne({ email: data.email }).then(result => {
                    if (!result) {
                        reject(CONSTANT.NOTREGISTERED)
                    }
                    else {
                        if (commonFunctions.compareHash(data.password, result.password)) {
                            resolve(result)
                        }
                        else
                            reject(CONSTANT.WRONGCREDENTIALS)
                    }
                })
            }

        })
    }


    editUser(data, file) {
        return new Promise((resolve, reject) => {

            if (!data) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                var query = {}
                if (data.nickName)
                    query.nickName = data.nickName
                if (file)
                    query.profilePic = '/' + file.filename
                if (data.email)
                    query.email = data.email
                if (data.countryCode)
                    query.countryCode = data.countryCode
                if (data.state)
                    query.state = data.state
                if (data.area)
                    query.area = data.area
                if (data.password)
                    query.password = commonFunctions.hashPassword(data.password)
                console.log(query);
                userModel.findByIdAndUpdate({ _id: data._id }, { $set: query }, { new: true }).then(update => {
                    resolve(update)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            }
        })
    }

    ownerVerify(_id) {
        return new Promise((resolve, reject) => {
            ownerModel.findByIdAndUpdate({ _id: _id }, { $set: { isAdminVerified: true } }, { new: true }).then(del => {
                resolve(del)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }

    editService(data, file) {
        return new Promise((resolve, reject) => {

            if (!data) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                var query = {}
                if (data.firstName)
                    query.firstName = data.firstName
                if (file)
                    query.profilePic = '/' + file.filename
                if (data.email)
                    query.email = data.email
                if (data.lastName)
                    query.lastName = data.lastName
                if (data.username)
                    query.username = data.username
                if (data.status)
                    query.status = data.status
                if (data.password)
                    query.password = commonFunctions.hashPassword(data.password)
                console.log(query);
                serviceModel.findByIdAndUpdate({ _id: data._id }, { $set: query }, { new: true }).then(update => {
                    resolve(update)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            }
        })
    }


    deleteUser(_id) {
        if (!_id) {
            reject(CONSTANT.MISSINGPARAMS)
        }
        else {
            return new Promise((resolve, reject) => {
                userModel.findByIdAndUpdate({ _id: _id }, { $set: { isDeleted: 1 } }, { new: true }).then(del => {
                    resolve(del)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            })
        }
    }


    deleteService(_id) {
        if (!_id) {
            reject(CONSTANT.MISSINGPARAMS)
        }
        else {
            return new Promise((resolve, reject) => {
                serviceModel.findByIdAndUpdate({ _id: _id }, { $set: { isDeleted: 1 } }, { new: true }).then(del => {
                    resolve(del)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            })
        }
    }

    generateUserCSV(req, res) {
        let fields = ["_id", "email", "countryCode", "nickName", "area", "state", "callType"]

        const opts = { fields };

        try {
            userModel.find().then(data => {
                const parser = new Parser(opts);
                var array = []
                data.map(value => {
                    var csvData = {}
                    csvData._id = value._id
                    csvData.email = value.email;
                    csvData.countryCode = value.countryCode;
                    csvData.nickName = value.nickName;
                    csvData.area = value.area;
                    csvData.state = value.state;
                    csvData.callType = value.callType;
                    array.push(csvData)
                })

                const csv = parser.parse(array);
                var path = './public/csv/'
                var name = '/user' + Date.now() + ".csv"
                var address = path + name
                fs.writeFile(address, csv, err => {
                    if (err)
                        console.log(data);
                    else
                        res.send({ message: "Downloaded successfully", status: 'true', file: name })
                })

            }).catch(err => {
                console.log(err);

            })
        } catch (err) {
            console.error(err);
        }

    }

    generateServiceCSV(req, res) {
        let fields = ["_id", "email", "contact", "firstName", "lastName", "username", "gender", "status", "language"]

        const opts = { fields };

        try {
            serviceModel.find().then(data => {
                const parser = new Parser(opts);
                var array = []
                data.map(value => {
                    var csvData = {}
                    if (value.status === 1)
                        csvData.status = 'online'
                    else
                        csvData.status = 'offline'
                    csvData._id = value._id
                    csvData.email = value.email;
                    csvData.contact = value.contact;
                    csvData.firstName = value.firstName;
                    csvData.lastName = value.lastName;
                    csvData.username = value.username;
                    csvData.gender = value.gender;
                    csvData.language = value.language;


                    array.push(csvData)
                })

                const csv = parser.parse(array);
                var path = './public/csv/'
                var name = '/service' + Date.now() + ".csv"
                var address = path + name
                fs.writeFile(address, csv, err => {
                    if (err)
                        console.log(data);
                    else
                        res.send({ message: "Downloaded successfully", status: 'true', file: name })
                })

            }).catch(err => {
                console.log(err);

            })
        } catch (err) {
            console.error(err);
        }

    }

    getRequestCount() {
        return new Promise((resolve, reject) => {
            bookingModel.aggregate([
                {
                    $group: {
                        "_id": "$status",
                        "count": { $sum: 1 }
                    }
                }

            ]).then(result => {
                resolve(result)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }


    displayBookings(data) {
        return new Promise((resolve, reject) => {

            let query = {}
            if (data.from && data.to)
                query.date = {
                    $gte: data.from,
                    $lte: data.to
                }
            if (data.boookingFrom && data.bookingTo)
                query.schedule = {
                    $gte: data.boookingFrom,
                    $lte: data.bookingTo
                }
            console.log(query);

            bookingModel.find(query).then(result => {
                resolve(result)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }
    displayUsers() {
        return new Promise((resolve, reject) => {
            userModel.find({}).select('_id email countryCode profilePic gender nickName callType area state').populate({ path: 'allRatings' }).then(result => {
                resolve(result)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }
    displayServices() {
        return new Promise((resolve, reject) => {
            serviceModel.find({}).select('_id email contact status gender firstName lastName profilePic').populate({ path: 'avgratings' }).then(result => {
                resolve(result)
            }).catch(error => {
                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }
    updateBooking(data) {
        return new Promise((resolve, reject) => {
            if (!data)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                var query = {}
                if (data.serviceRatings)
                    query.serviceRatings = data.serviceRatings
                if (data.userRatings)
                    query.userRatings = data.userRatings
                if (data.status)
                    query.status = data.status
                if (data.houseName)
                    query.houseName = data.houseName
                if (data.houseNumber)
                    query.houseNumber = data.houseNumber
                if (data.assignedUser)
                    query.userId = mongoose.Types.ObjectId(data.assignedUser)
                console.log(query);

                bookingModel.findByIdAndUpdate({ _id: data.bookingId }, { $set: query }, { new: true }).then(result => {
                    resolve(result)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            }


        })
    }

    addCategory(data) {
        console.log(data);

        return new Promise((resolve, reject) => {
            if (!data.carType || !data.baseFare)
                reject(CONSTANT.MISSINGPARAMS)
            else {
                const category = this.createCategory(data)

                category.save({}).then(result => {
                    resolve(result)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    return reject(error)
                })
            }


        })
    }

    createCategory(data) {
        data.date = moment().valueOf()
        const category = new carCategory(data)
        return category
    }

}
module.exports = new admin()