var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');

module.exports = (pool) => {

  router.get('/', helpers.isLoggedIn, function (req, res, next) {
    // console.log(req.session.user.email);
    let sql = `SELECT * FROM users WHERE userid=${req.session.user.userid}`

    pool.query(sql, (err, result) => {
      // console.log(result);
      
      if (err) throw err;

      res.render('profile/view', {
        user: req.session.user.email,
        data: result.rows[0],
        result
      })
    });
  });

  router.post('/', helpers.isLoggedIn, function (req, res, next) {

    let sql = `UPDATE users SET password=$1 WHERE userid=${req.session.user.userid}`
    let data = [req.body.password]

    pool.query(sql, data, (err, result) => {
      console.log(data);
      
      if (err) throw err;

      res.redirect('/profile')
    })
  })
  return router;
};

