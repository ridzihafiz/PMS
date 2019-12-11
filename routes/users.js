var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');


module.exports = (pool) => {
  
  router.get('/', helpers.isLoggedIn, function (req, res, next) {

    sql = `SELECT * FROM users`

    pool.query(sql, (err, result) => {
      // console.log(result.rows);
      
      res.render('users/users', { 
        user: req.session.user.email,
        data: result.rows
      });
    });
  });

  
  // USERS CRUD
  // router bebas namanya dan harus sama dengan button ejs
  router.get('/usersadd', helpers.isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file usersadd.ejs
    res.render('users/usersadd', { user: req.session.user.email });
  });

  router.post('/usersadd', helpers.isLoggedIn, (req, res, next) => {
    // console.log(req.body);

    let email = req.body.email
    let password = req.body.password
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let position = req.body.position
    let typejob = req.body.typejob

    let sql = `INSERT INTO users (email, password, firstname, lastname, position, typejob) VALUES ($1, $2, $3, $4, $5, $6)`;
    // let sql = `INSERT INTO users (email, password, firstname, lastname, position, typejob) VALUES ('${email}', '${password}', '${firstname}', '${lastname}', '${position}', '${typejob}')`;
    // console.log(sql);
    
    let data = [email, password, firstname, lastname, position, typejob]

    pool.query(sql, data, (err, row) => {
      console.log(row);
      
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect('/users');
    });
  });


  router.get('/usersedit/:userid', helpers.isLoggedIn, (req, res, next) => {

    let id = parseInt(req.params.userid)
    let sql = `SELECT * FROM users WHERE userid=${req.params.userid}`
    // console.log(sql);
    
    pool.query(sql, (err, data) => {
      // console.log(data.rows);
      
      if (err) throw err;
      res.render('users/usersedit', { 
        data: data.rows[0],
        user: req.session.user.email });
    })
  });

  // router.post('/usersedit/:userid', helpers.isLoggedIn, (req, res, next) => {
  //   let id = req.params.userid
    
  //   res.redirect('/users', { user: req.session.user });
  // });



  router.get('/delete/:userid', helpers.isLoggedIn, (req, res, next) => {
    
    let deluserid = req.params.userid
    let sql = `DELETE FROM users WHERE userid =$1`;

    console.log(sql);
    
    pool.query(sql, [deluserid], (err) => {
      if (err) throw err
      res.redirect('/users');
    })
  });

  return router;
};

// module.exports = router;