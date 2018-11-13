const bcrypt = require('bcrypt');

module.exports = (app, db) => {

  // POST register a new user
  app.post('/register', (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const reference = req.body.reference;

    db.users.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    })
      .then(newUser => {
        newUser.addCourse(reference);
        res.json(newUser);
      })
      .catch(next);
  });

  // POST log a user in
  app.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    db.users.scope('withPassword').findOne({
      where: { email: email },
      attributes: { exclude: ['id'] }
    })
      .then(foundUser => {
        bcrypt.compare(password, foundUser.password).then(match => {
          if (match) { res.json(foundUser); } 
        });
      })
      .catch(next);
  });

  

};