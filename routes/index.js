var express = require('express');
var router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/')
  }
}

module.exports = (pool) => {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', { info: req.flash('info') });
  });

  // router.get('/projects', isLoggedIn, function (req, res, next) {
  //   res.render('projects/list', { user: req.session.user });
  // });

  // router.get('/projects/add', isLoggedIn, function (req, res, next) {
  //   res.render('/projects/add', { user: req.session.user });
  // });

  router.post('/login', function (req, res, next) {
    let { email, password } = req.body;
    let sql = `SELECT email, password FROM users WHERE email = '${email}'`
    pool.query(sql, (err, data) => {
      // console.log(data);
      if (data.rows[0].email == email && data.rows[0].password == password) {
        req.session.user = req.body.email;
        res.redirect('/projects') // redirect baca project.js
      } else {
        req.flash('info', 'email or password is wrong')
        res.redirect('/');
      }
    })
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
      res.redirect('/');
    })
  })

  return router;

};

// module.exports = router;