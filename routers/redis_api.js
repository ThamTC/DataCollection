const express = require("express")
const router = express.Router()
const db = require("../models/index")
const redis = require("redis")
const redis_client = redis.createClient(process.env.REDIS_PORT)
redis_client.on("error", (error) => {
    throw error
})

router.get("/index", (req, res) => {
    var resData = []
    redis_client.get("do-alarm", (err, data) => {
        if (err) {
            throw err
        } else if (data != null) {
            // chuyen string ve object
            resData = JSON.parse(data)
        }
        return res.status(200).send(resData)
    })

})

router.post("/update", (req, res) => {
    var resData = []
    redis_client.get("do-alarm", (err, data) => {
        if (err) {
            throw err
        } else if (data != null) {
            // chuyen string ve object
            resData = JSON.parse(data)
            for (let idx = 0; idx < resData.length; idx++) {
                if (req.body.id == idx) {
                    resData[idx].isAction = req.body.isAction
                    resData[idx].username = req.body.username
                    break
                }
            }
            redis_client.set("do-alarm", JSON.stringify(resData))
        }
        global.io.sockets.emit("do-alarm", resData)
        return res.status(200).send("success")
    })
})

router.post("/delete", (req, res) => {
    var resData = []
    redis_client.get("do-alarm", async(err, data) => {
        if (err) {
            throw err
        } else if (data != null) {
            // chuyen string ve object
            resData = JSON.parse(data)
            for (let idx = 0; idx < resData.length; idx++) {
                if (req.body.id == idx) {

                    const d = new Date()
                    const doAlarm = {
                        "content": resData[idx].content,
                        "count": resData[idx].count,
                        "userCheck": req.body.userCheck,
                        "userDone": req.body.userDone,
                        "doneTime": d.toLocaleString()
                    }
                    try {
                        resData.splice(idx, 1);
                    } catch (error) {
                        throw error
                    }
                    const isCreate = await db.Doalarm.create(doAlarm)
                    if (!isCreate) {
                        return res.status(200).send("Co loi trong qua trinh thao tac DB")
                    }
                    break
                }
            }
            redis_client.set("do-alarm", JSON.stringify(resData))
        }
        global.io.sockets.emit("do-alarm", resData)
        return res.status(200).send("success")
    })
})

module.exports = router