const db = require("../models/index")

userController = {
    getAllUser: async(req, res) => {
        try {
            const users = await db.User.findAll()
            return res.status(200).send(users)
        } catch (error) {
            return res.status(401).send(error)
        }
    }
}

module.exports = userController