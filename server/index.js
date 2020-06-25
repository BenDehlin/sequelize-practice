require("dotenv").config({ path: __dirname + "/../.env" })
const express = require("express")
const session = require("express-session")
// const massive = require("massive")
const app = express()


const { SERVER_PORT, SESSION_SECRET } = process.env

//Controllers
const authCtrl = require("./controllers/authController")
const sqlCtrl = require('./controllers/sequelizeController')
const newAuthCtrl = require('./controllers/newAuthController')

//Middleware
const authMid = require("./middleware/authMiddleware")
app.use(express.json())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
)

//Database connection
const db = require('./config/database')
app.set('db', db)
const User = require('./models/User')
app.set("User", User)
db.authenticate().then(() => {
  console.log('Connection Established')
  app.listen(SERVER_PORT, console.log(`Server listening on ${SERVER_PORT}`))
}).catch(err => console.log(err))
// massive({
//   connectionString: CONNECTION_STRING,
//   ssl: { rejectUnauthorized: false },
// }).then((db) => {
//   app.set("db", db)
//   console.log("Database connected")
//   const io = require("socket.io")(
//     app.listen(SERVER_PORT, () =>
//       console.log(`Server listening on ${SERVER_PORT}`)
//     )
//   )
//   app.set("io", io)
//   //Socket connection
//   io.on("connection", (socket) => {
//     console.log("User connected")
//   })
// })

//Endpoints
//Auth Endpoints
app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)
app.post("/auth/logout", authCtrl.logout)
app.get("/auth/user", authMid.usersOnly, authCtrl.getUser)

//Sequelize Endpoints
app.get('/api/test', sqlCtrl.test)
app.get('/api/test2', sqlCtrl.testTwo)
app.post('/api/test3', sqlCtrl.testThree)
app.post('/auth/registertest', newAuthCtrl.register)