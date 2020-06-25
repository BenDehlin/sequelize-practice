require("dotenv").config({ path: __dirname + "/../.env" })
const express = require("express")
const app = express()

const { SERVER_PORT, SESSION_SECRET } = process.env

//Controllers
const authCtrl = require("./controllers/authController")

//Middleware
const authMid = require("./middleware/authMiddleware")
app.use(express.json())
app.use(
  require("express-session")({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
)

//Database connection
const db = require("./config/database")
const User = require("./models/User")
app.set("db", db)
app.set("User", User)
db.authenticate()
  .then(() => {
    console.log("Connection Established")
    const io = require("socket.io")(
      app.listen(SERVER_PORT, () =>
        console.log(`Server listening on ${SERVER_PORT}`)
      )
    )
    app.set("io", io)
    io.on("connection", (socket) => {
      console.log("User connected")
    })
  })
  .catch((err) => console.log(err))

//Endpoints
//Auth Endpoints
app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)
app.post("/auth/logout", authCtrl.logout)
app.get("/auth/user", authMid.usersOnly, authCtrl.getUser)
