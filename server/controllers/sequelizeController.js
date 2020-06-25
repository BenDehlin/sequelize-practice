module.exports = {
  test: (req, res) => {
    // const db = req.app.get('db')
    const User = req.app.get("User")
    User.findAll().then((users) => {
      console.log(users)
      res.status(200).send(users)
    }).catch(err => res.status(500).send(err))
  },
  testTwo: (req, res) => {
    const User = req.app.get('User')
    const {email} = req.body
    console.log(email)
    User.findAll({where: {email}}).then(users => {
      console.log(users)
      res.status(200).send(users)
    }).catch(err => res.status(500).send(err))
  },
  testThree: (req, res) => {
    const User = req.app.get("User")
    const {username, email, password} = req.body
    User.create({ username, email, password, is_admin: false }).then(user =>{
      console.log(user)
      res.status(200).send(user)
    }).catch(err => res.status(500).send(err))
  }
}