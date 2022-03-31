require('dotenv').config()

const express = require("express")
const expressLayout = require("express-ejs-layouts")
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressLayout)
app.set("layout", "./layouts/full-width")
    // app.set("user_layout", "./layouts/user-layout")
app.use(express.static(__dirname + '/public'))
app.set("view engine", "ejs")
app.set("views", "./views")
const web_router = require("./routers/web_router")
const api_router = require("./routers/api_router")
const redis_api = require("./routers/redis_api")
const userRouter = require("./routers/user_router")
const authApi = require("./routers/auth.router")
const db = require("./config/connectDB")

db.connectDB()

const server = require("http").Server(app)

global.io = require('socket.io')(server)
const meterSendData = require("./routers/meterSendData")
app.use(web_router)
app.use("/api", meterSendData)
app.use("/warning", api_router)
app.use("/api/redis", redis_api)
app.use("/user", userRouter)
app.use("/api/auth", authApi)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

server.listen(process.env.PORT || 3000)

global.io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id)
    socket.on("send_meter", function() {})
})

// app.get("/", function(req, res) {
//     res.render("trangchu")
// })