const express = require("express")
const router = express.Router()
const authController = require("../auth/controllers/auth.controller")

router.post("/login", authController.login)

module.exports = router