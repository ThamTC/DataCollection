var express = require("express")
const redis = require("redis")
const client = redis.createClient(process.env.REDIS_PORT || 6379)
var web_router = express.Router()

web_router.get("/alarm", function(req, res) {
    client.get("alarm_data", (err, data) => {

        if (err) {
            throw err
        } else if (data == null) {
            res.render("trangchu", {
                data: JSON.stringify([])
            })
        } else {
            res.render("trangchu", {
                data: JSON.stringify(data)
            })
        }

    })
})
module.exports = web_router