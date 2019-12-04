var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');

module.exports = (pool) => {

  router.get('/', helpers.isLoggedIn, (req, res, next) => {

    const pathside = "projects";
    console.log(req.url);

    const { ckid, id, ckname, name, ckmember, member } = req.query;
    const url = (req.url == '/') ? `/?page=1` : req.url
    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit
    let params = [];

    if (ckid && id) {
      params.push(`projects.projectid = ${id}`);
    }
    if (ckname && name) {
      params.push(`projects.name LIKE '%${name}%'`)
    }
    if (ckmember && member) {
      params.push(`members.userid = ${member}`)
    }

    let sql = `SELECT COUNT(id) as total FROM (SELECT DISTINCT projects.projectid AS id FROM projects LEFT JOIN members ON projects.projectid = members.projectid`;

    if (params.length > 0) {
      sql += ` WHERE ${params.join(" AND ")}`
    }
    sql += `) AS projectmember`;
    console.log('counting', sql);
    

    pool.query(sql, (err, count) => {

      const total = count.rows[0].total;
      const pages = Math.ceil(total / limit)

      sql = `SELECT DISTINCT projects.projectid, projects.name FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
                  
      if (params.length > 0) {
        sql += ` WHERE ${params.join(" AND ")}`
      }
      sql += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
      let subquery = `SELECT DISTINCT projects.projectid FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
      if (params.length > 0) {
        subquery += ` WHERE ${params.join(" AND ")}`
      }
      subquery += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
      let sqlMembers = `SELECT projects.projectid, users.userid, CONCAT (users.firstname,' ',users.lastname) AS fullname FROM projects LEFT JOIN members ON projects.projectid = members.projectid LEFT JOIN users ON users.userid = members.userid WHERE projects.projectid IN (${subquery})`

      console.log('data', sql);

      pool.query(sql, (err, projectData) => {

        if (err) throw err;

        pool.query(sqlMembers, (err, memberData) => {

          projectData.rows.map(project => {
            project.members = memberData.rows.filter(member => { return member.projectid == project.projectid }).map(data => data.fullname)
          })
          let sqlusers = `SELECT * FROM users`;
          let sqloption = `SELECT projectsoptions FROM users WHERE userid =${req.session.user.userid}`;

          pool.query(sqlusers, (err, data) => {
            console.log('this data users >', data.rows);

            pool.query(sqloption, (err, options) => {
              res.render('projects/list', {
                data: projectData.rows,
                query: req.query,
                users: data.rows,
                current: page,
                pages: pages,
                url: url,
                pathside,
                // option: JSON.parse(options.rows[0].projectsoptions),
                user: req.session.user
              })
            })
          })
        })
      })
    })
    
  });
  

  router.get('/add', helpers.isLoggedIn, (req, res, next) => {
    let sql = `SELECT userid, firstname || ' ' || lastname AS fullname from users`

    pool.query(sql, (err, users) => {
      res.render('projects/add', { user: req.session.user, users: users.rows });

    })
  });

  router.post('/add', (req, res) => {

    let sql = `INSERT INTO projects (name) VALUES ('${req.body.projectname}')`;

    pool.query(sql, (err) => {

      let sqlnext = `SELECT MAX(projectid) total FROM projects`;
      
      pool.query(sqlnext, (err, result) => {
        if (err) return res.send(err);
        
        let temp = [];
        const projectId = result.rows[0].total;
        if (typeof req.body.members == "string") {
          temp.push(`(${req.body.members}, ${projectId})`);
        } else {
          for (let i = 0; i < req.body.members.length; i++) {
            temp.push(`(${req.body.members[i]}, ${projectId})`);
          }
        }
        let sqladd = `INSERT INTO members (userid, projectid) VALUES ${temp.join(
          ", "
        )}`;

        pool.query(sqladd, err => {
          if (err) res.send(err);
          req.flash("info", "1 record projects inserted");
          res.redirect("/projects");
        });

      });
    });
  });


  router.get('/edit', helpers.isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file edit.ejs
    res.render('projects/edit', { user: req.session.user });
  });

  router.get('/delete', helpers.isLoggedIn, (req, res, next) => {
    // render mengambil folder projects dan file edit.ejs
    res.render('projects/delete', { user: req.session.user });
  });




  return router;
};

// module.exports = router;