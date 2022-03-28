const express = require("express")
const router = express.Router()

router.post('/alarm', async(req, res) => {
    global.io.sockets.emit('alarm_data', req.body);

    return res.status(200).json({ "data": req.body });

});

module.exports = router;