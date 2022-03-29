const express = require("express")
const redis = require("redis")
const router = express.Router()
redis_client = redis.createClient(process.env.REDIS_PORT)
redis_client.on("error", function(error) {
    console.error(error);
});

router.post('/alarm', async(req, res) => {
    global.io.sockets.emit('alarm_data', req.body);

    redis_client.get("warning", (err, data) => {
        var resData = []
        if (err) {
            throw err
        } else if (data != null) {
            resData = JSON.parse(data)
        }
        resData.unshift(req.body)
            // console.log(resData)
        redis_client.set("warning", JSON.stringify(resData))
    })
    return res.status(200).json({ "data": req.body });

});

module.exports = router;