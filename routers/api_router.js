var express = require("express")
var router = express.Router()

api_router = [
    send_warning = () => {
        router.post('/api/send_warning', function(req, res) {
            res.send({
                "status": "success"
            })
        })
    }
]


module.exports = api_router