var express = require("express")
var web_router = express.Router()
var db = require('../models/index')

web_router.get("/meter", async function(req, res) {
    try {
        let meters = await db.Meter.findAll()
        res.render("trangchu", {
            meters: JSON.stringify(meters)
        })
    } catch (error) {
        console.log(error)
    }

})
module.exports = web_router