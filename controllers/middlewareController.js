const jwt = require("jsonwebtoken")
const redisToken = require("../redis/redis")

const middlewareController = {
    isLogin: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) {
                    throw err
                }
                req.user = user
            })
            next()
        } else {
            return res.redirect("user/login")
        }

    },
    verifyToken: (req, res, next) => {
        const token = req.headers.token
        console.log(token)
        if (token) {
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
                if (err) {
                    return res.status(403).send("Token is not valid")
                }
                req.user = user
                next()
            })
        } else {
            return res.redirect("/user/login")
        }
    }
}

module.exports = middlewareController