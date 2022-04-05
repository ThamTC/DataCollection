const express = require("express")
const router = express.Router()

router.get("/login", (req, res) => {
    res.render("./pages/auth/login", { layout: './layouts/user-layout' })
})

router.get("/register", (req, res) => {
    res.render("./pages/auth/register", { layout: './layouts/user-layout' })
})

router.get("/password", (req, res) => {
    res.render("./pages/auth/password", { layout: './layouts/user-layout' })
})
module.exports = router