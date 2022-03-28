require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", "./views")
const web_router = require("./routers/web_router")
const api_router = require("./routers/api_router")
const db = require("./config/connectDB")

db.connectDB()

const server = require("http").Server(app)
global.io = require("socket.io")(server)
const meterSendData = require("./routers/meterSendData")
app.use(web_router)
app.use("/api", meterSendData)

server.listen(process.env.PORT || 3000)

global.io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id)
    socket.on("send_meter", function() {})
})

// app.get("/", function(req, res) {
//     res.render("trangchu")
// })