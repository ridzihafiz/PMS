var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');


module.exports = (pool) => {
  
  router.get('/', helpers.isLoggedIn, function (req, res, next) {

    sql = `SELECT * FROM users`

    pool.query(sql, (err, result) => {
      // console.log(result.rows);
      
      res.render('users/users', { 
        user: req.session.user,
        data: result.rows
      });
    });
  });

  
  // USERS CRUD
  // router bebas namanya dan harus sama dengan button ejs
  router.get('/usersadd', (req, res, next) => {
    // render mengambil folder projects dan file usersadd.ejs
    res.render('users/usersadd', { user: req.session.user });
  });

  // router.post('/usersadd-save', (req, res, next) => {
  //   console.log(req.body);
  //   res.render('Berhasil');
  // });


  router.post('/usersadd', helpers.isLoggedIn, (req, res, next) => {
    console.log(req.body);

    let email = req.body.email
    let password = req.body.password
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let position = req.body.position
    let typejob = req.body.typejob

    let sql = `INSERT INTO users (email, password, firstname, lastname, position, typejob) VALUES ($1, $2, $3, $4, $5, $6)`;
    
    let data = [email, password, firstname, lastname, position, typejob]

    pool.query(sql, data, (err) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
    res.redirect('/users', { user: req.session.user });
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