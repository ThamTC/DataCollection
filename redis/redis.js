const redis = require("redis")
const redis_client = redis.createClient(process.env.REDIS_PORT)
redis_client.on("error", (error) => {
    throw error
})

const redisToken = {
    setData: async(key, value) => {
        redis_client.set(key, JSON.stringify(value))
    },
    getData: async(key) => {
        const resData = []
        resData = await JSON.parse(redis_client.get(key))
        return resData
    },
    clearData: (key) => {
        const resData = []
        redis_client.set(key, JSON.stringify(resData))
    },
    updateData: async(key, value, newValue) => {
        const resData = []
        resData = await JSON.parse(redis_client.get(key))
        for (let idx = 0; idx < resData.length; idx++) {
            if (resData[idx] === value) {
                resData[idx] = newValue
                break
            }
        }
    },
    storeToken: (key, value) => {
        var resData = []
        redis_client.get(key, (err, data) => {
            if (err) {
                throw err
            }
            if (data != null) {
                resData = JSON.parse(data)
            }
            let isFoundValue = false
            for (let idx = 0; idx < resData.length; idx++) {
                if (resData[idx] === value) {
                    resData[idx] = value
                    isFoundValue = true
                    break
                }
            }
            if (!isFoundValue) {
                resData.push(value)
            }
            redis_client.set(key, JSON.stringify(resData))
        })
    },
    isExistToken: (refreshToken) => {
        const tokens = []
        tokens = redisToken.getData("refreshToken")
        if (!tokens.includes(refreshToken)) {
            return false
        }
        return true
    },
    clearCacheInterval: () => {
        setInterval(() => {
            const d = new Date()
            if (d.getHours() == process.env.REDIS_TIME_CLEAR && d.getMinutes() == 0) {
                redisToken.clearData("warning")
                redisToken.clearData("do-alarm")
            }
        }, 1000 * 60);
    }
}

module.exports = redisToken