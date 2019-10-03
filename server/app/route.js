const express = require("express");
const owner = require('../app/owner/ownerRoutes/ownerRoutes')
const user = require('../app/user/userRoutes/userRoute')
const admin = require('../app/admin/adminRoutes/adminRoutes')




const rentRoutes = express.Router()
rentRoutes.use('/owner', owner)
rentRoutes.use('/user', user)
rentRoutes.use('/admin', admin)


module.exports = rentRoutes;