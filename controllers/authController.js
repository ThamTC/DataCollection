const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../models/index")
const redisToken = require("../redis/redis")


const authController = {
    generateAccessToken: (user) => {
        return jwt.sign({ name: user.name, email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
    },
    generateRefreshToken: (user) => {
        return jwt.sign({ name: user.name, email: user.email }, process.env.REFRESH_TOKEN, { expiresIn: "365d" })
    },
    login: async(req, res) => {
        const email = req.body.email
        const password = req.body.password
        const user = await db.User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(200).send({ "error": true, "content": "Tên đăng nhập không tồn tại" })
        }
        const isPass = await bcrypt.compare(password, user.password)
        if (!isPass) {
            return res.status(200).send({ "error": true, "content": "Sai mật khẩu" })
        }
        const accesssToken = authController.generateAccessToken(user)
        const refreshToken = authController.generateRefreshToken(user)
        redisToken.storeToken("accessToken", accesssToken)
        redisToken.storeToken("refreshToken", refreshToken)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        return res.status(200).json({ id: user.id, name: user.name, accesssToken })
    },
    register: async(req, res) => {
        const name = req.body.name
        const email = req.body.email
        const user = await db.User.findOne({ where: { email: email } })
        if (user) return res.status(200).send({ "error": true, "content": 'Email đã tồn tại.' });
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm
        if (password != passwordConfirm) {
            return res.status(200).send({ "error": true, "content": "Nhập sai Pasword" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = {
            name: name,
            email: email,
            password: hashPassword
        };
        const createUser = await db.User.create(newUser)
        if (!createUser) {
            return res
                .status(200)
                .send({ "error": true, "content": 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.' });
        }
        return res.status(200).send({ "error": false, "content": "Đăng ký thành công" });

    },
    logout: (req, res) => {
        res.cookie("refreshToken", '', {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        res.end()
            // return res.redirect("/user/login")

    },
    refreshToken: async(req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).send({ "error": true, "content": "You're not authenticated" })
        }
        if (redisToken.isExistToken(refreshToken)) {
            return res.status(403).send("Refresh Token is not valid")
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).send("Token is not valid")
            }
            // create new accessToken, new refreshToken
            var newAccessToken = authController.generateAccessToken(user)
            var newRefreshToken = authController.generateRefreshToken(user)
            redisToken.storeToken("accessToken", newAccessToken)
            redisToken.storeToken("refreshToken", newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            return res.status(200).send({ "error": false, "content": newAccessToken })
        })
    }
}
module.exports = authController