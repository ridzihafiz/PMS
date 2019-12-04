var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');


module.exports = (pool) => {
  
  router.get('/navusers', helpers.isLoggedIn, function (req, res, next) {
    res.render('users/users', { user: req.session.user });
  });

  
  // USERS CRUD
  // router bebas namanya dan harus sama dengan button ejs
  router.get('/usersadd', helpers.isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file usersadd.ejs
    res.render('users/usersadd', { user: req.session.user });
  });

  router.post('/usersadd', helpers.isLoggedIn, (req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    let firstname = req.body.firstname
    let lastname = req.body.lastname

    let sql = `INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4)`;
    // let data = [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean]
    let data = [email, password, firstname, lastname]

    pool.query(sql, data, (err) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
    res.redirect('users/usersadd', { user: req.session.user });
  });


  router.get('/usersedit', helpers.isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file usersedit.ejs
    res.render('users/usersedit', { user: req.session.user });
  });


  router.get('/delete', helpers.isLoggedIn, (req, res, next) => {
    res.render('users/delete', { user: req.session.user });
  });

  return router;
};

// module.exports = router;