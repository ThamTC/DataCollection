var express = require("express")
const redis = require("redis")
const redis_client = redis.createClient(process.env.REDIS_PORT || 6379)
var web_router = express.Router()
const middlewareController = require("../controllers/middlewareController")

web_router.get("/", middlewareController.isLogin, function(req, res) {
    redis_client.get("warning", (err, data) => {
        var resData = []
        resData = JSON.parse(data)
        if (err) {
            throw err
        }
        return res.render("trangchu", {
            data: resData,
            pagination: false
        })

    })
})

web_router.get("/alarm", middlewareController.isLogin, function(req, res) {

    redis_client.get("warning", (err, data) => {
        var resData = []
        resData = JSON.parse(data)
        if (err) {
            throw err
        } else if (data != null) {
            return res.render("trangchu", {
                data: resData
            })
        } else {
            return res.render("trangchu", {
                data: []
            })
        }

    })
})
web_router.get("/do-alarm", middlewareController.isLogin, function(req, res) {
    console.log(req.user)
    return res.render("do_alarm", { user: req.user })
})
module.exports = web_router