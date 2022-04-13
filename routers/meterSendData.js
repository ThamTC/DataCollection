const express = require("express")
const redis = require("redis")
const router = express.Router()

redis_client = redis.createClient(process.env.REDIS_PORT)
redis_client.on("error", function(error) {
    throw error
});

router.post('/alarm', async(req, res) => {
    try {
        var dataRedis = {}
        var contact = req.body.contact.split(',')

        if (contact.length > 1) {
            dataRedis.contact = contact[0] + ",..."
        } else {
            dataRedis.contact = contact[0]
        }
        console.log(dataRedis.contact)
        dataRedis.name = req.body.name
        dataRedis.content = req.body.content
        dataRedis.style = req.body.style
        dataRedis.status = req.body.status
        dataRedis.time = req.body.time
        dataRedis.contactAppend = req.body.contact

        global.io.sockets.emit('alarm_data', dataRedis);

        redis_client.get("warning", (err, data) => {
            var warData = []
            if (err) {
                throw err
            } else if (data != null) {
                warData = JSON.parse(data)
            }
            warData.unshift(dataRedis)
                // console.log(warData)
            redis_client.set("warning", JSON.stringify(warData))
        })

        redis_client.get("do-alarm", (err, data) => {
            var resData = []
            if (err) {
                throw err
            } else if (data != '[]') {
                resData = JSON.parse(data)
                    // tang so dem ban ghi trung nhau
                var isDuplicate = false
                resData.forEach(element => {
                    if (req.body.content === element.content) {
                        element.count++
                            isDuplicate = true
                    }
                });
                // neu khong tim thay ban ghi trung nhau thi them vao mang
                if (!isDuplicate) {
                    resData.push({
                        "name": req.body.name || "",
                        "content": req.body.content || "",
                        "count": 1,
                        "isAction": false,
                        "username": ""
                    })
                }
                // sap xep giam dan
                resData.sort(function(a, b) {
                    if (a.count > b.count) return -1
                    if (a.count < b.count) return 1
                    return 0
                })
            } else {
                // add default element
                resData.push({
                    "name": req.body.name || "",
                    "content": req.body.content,
                    "count": 1,
                    "isAction": false,
                    "username": ""
                })
            }

            redis_client.set("do-alarm", JSON.stringify(resData))
            global.io.sockets.emit("do-alarm", resData)
        })

        return res.status(200).json({ "status": "success" });
    } catch (error) {
        return res.status(500).json("Kiểm tra lại khung truyền");
    }


});

module.exports = router;