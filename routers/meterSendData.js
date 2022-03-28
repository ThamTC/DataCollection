const express = require("express")
const router = express.Router()

router.post('/send_meter', async(req, res) => {
    global.io.on('connection', function(socket) {
            console.log("cos nguoi request" + socket.id)
        })
        //pickedUser is one of the connected client
    var pickedUser = "JZLpeA4pBECwbc5IAAAA";
    global.io.sockets.emit('meter', req.body);

    return res.status(200).json({ "data": req.body });

});

module.exports = router;