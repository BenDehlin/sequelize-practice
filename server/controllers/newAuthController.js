const { hashSync, genSaltSync } = require("bcryptjs")
module.exports = {
  register: async (req, res) => {
    const User = req.app.get("User")
    const { username, email, password } = req.body
    if (await User.findOne({ where: { email } })) {
      return res.status(409).send("Email already registered")
    }
    if (await User.findOne({ where: { username } })) {
      return res.status(409).send("Username taken")
    }
    User.create({
      username,
      email,
      password: hashSync(password, genSaltSync(10)),
      is_admin: false,
    })
      .then((user) => {
        req.session.user = user.noPassword()
        console.log(req.session.user)
        res.status(200).send(req.session.user)
      })
      .catch((err) => res.status(500).send(err))
  },
  login: async (req, res) => {
    const User = req.app.get("User")
    const {username, password} = req.body
    const user = awaitUser.findOne({where: {username}})
    if(!user){
      return res.status(401).send('User not found.')
    }
    if(!bcrypt.compareSync(password, user.password)){
      
    }
  },
  logout: async (req, res) => {},
  getUser: async (req, res) => {},
}
