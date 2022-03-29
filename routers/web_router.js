var express = require("express")
const redis = require("redis")
const redis_client = redis.createClient(process.env.REDIS_PORT || 6379)
var web_router = express.Router()

web_router.get("/alarm", function(req, res) {
    redis_client.get("warning", (err, data) => {
        var resData = []
        resData = JSON.parse(data)
        if (err) {
            throw err
        } else if (data == null) {
            res.render("trangchu", {
                data: []
            })
        } else {
            res.render("trangchu", {
                data: resData
            })
        }

    })
})
module.exports = web_router