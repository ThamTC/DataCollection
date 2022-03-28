var express = require("express")
var api_router = express.Router()

api_router.post('/api/send_meter', function(req, res) {
    res.send({
        "status": "success"
    })
})

module.exports = api_router