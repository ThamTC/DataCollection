module.exports = {
    login: (req, res) => {
        console.log(req.body.username)
        return res.send("success")
    }
}