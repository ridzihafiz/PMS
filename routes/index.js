var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');


module.exports = (pool) => {

  router.get('/', function (req, res, next) {
    res.render('login', { info: req.flash('info') });
  });

  router.post('/login', function (req, res, next) {
    // req.body email dan password di ambil dari name ejs
    let { email, password } = req.body;
    let sql = `SELECT * FROM users WHERE email = '${email}'`
    pool.query(sql, (err, data) => {
      if (data.rows.length > 0) {
        if (data.rows[0].email == email && data.rows[0].password == password) {
          console.log('password>', data.rows[0].password);

          data.rows[0].password = null
          req.session.user = data.rows[0];

          res.redirect('/projects') // redirect baca project.js
        } else {
          req.flash('info', 'password is wrong')
          res.redirect('/');
        }
      } else {
        req.flash('info', 'email is wrong')
        res.redirect('/');
      }
    })
  });

  router.get('/logout', helpers.isLoggedIn, (req, res) => {
    req.session.destroy(function (err) {
      res.redirect('/');
    })
  })

  return router;

};