var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utils');

module.exports = (pool) => {

  router.get('/', helpers.isLoggedIn, (req, res, next) => {

    const pathside = "projects";
    // console.log(req.url);

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
    // console.log('counting', sql);


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

      // console.log('data >', sql);

      pool.query(sql, (err, projectData) => {
        // console.log('projectdata> ', projectData);
        
        if (err) throw err;

        pool.query(sqlMembers, (err, memberData) => {
          // console.log('memberdata> ', memberData);
          
          projectData.rows.map(project => {
            project.members = memberData.rows.filter(member => { return member.projectid == project.projectid }).map(data => data.fullname)
          })
          let sqlusers = `SELECT * FROM users`;
          let sqloption = `SELECT projectsoptions FROM users WHERE userid =${req.session.user.userid}`;

          pool.query(sqlusers, (err, data) => {
            // console.log('this data users >', data.rows);

            pool.query(sqloption, (err, options) => {
              // console.log(options);
              
              res.render('projects/list', {
                data: projectData.rows,
                query: req.query,
                users: data.rows,
                current: page,
                pages: pages,
                url: url,
                pathside,
                // option: JSON.parse(options.rows[0].projectsoptions),
                user: req.session.user.email
              })
            })
          })
        })
      })
    })
  });

  // router.post('/update', (req, res) => {
    
  //   let sql = `UPDATE users SET projectsoptions = '${JSON.stringify(req.body)}' WHERE userid =${req.session.user.userid} `
  //   // console.log(sql);
  //   // console.log(req.session.user);

  //   pool.query(sql, (err) => {
  //     if (err) throw err;

  //     res.redirect('/projects');
  //   })

  // })

  

  router.get('/add', helpers.isLoggedIn, (req, res, next) => {
    let sql = `SELECT userid, firstname || ' ' || lastname AS fullname from users`

    pool.query(sql, (err, users) => {
      res.render('projects/add', { user: req.session.user.email, users: users.rows });

    })
  });

  router.post('/add', (req, res) => {

    let sql = `INSERT INTO projects (name) VALUES ('${req.body.projectname}')`;

    pool.query(sql, (err) => {

      // if (req.body.members == undefined) {
      // req.body.members || null

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
      // }
    });
  });



  router.get('/edit/:projectid', helpers.isLoggedIn, (req, res, next) => {
    let edit = parseInt(req.params.projectid);
    let sql = `SELECT members.userid, projects.name, projects.projectid FROM members LEFT JOIN projects ON projects.projectid = members.projectid WHERE projects.projectid =$1`
    // console.log(sql);
    
    pool.query(sql, [edit], (err, data) => {
      pool.query(`SELECT * FROM users`, (err, user) => {
        if (err) throw err;

        res.render('projects/edit', {
          name: data.rows[0].name,
          projectid: data.rows[0].projectid,
          members: data.rows.map(item => item.userid),
          users: user.rows,
          user: req.session.user.email
        })
      })
    })
  });

  router.post('/edit/:projectid', helpers.isLoggedIn, (req, res, next) => {

    // const { name, member } = req.body;
    let id = req.params.projectid;
    console.log(id);
    
    let sql = `UPDATE projects SET name='${req.body.name}' WHERE projectid=${id}`
    console.log(req.body);
    pool.query(sql, (err) => {
      res.redirect('/projects')
    })
    
    // pool.query(sql, [id], (err, row) => {
    //   if (err) throw err;
    //   pool.query(`DELETE FROM members WHERE projectid = ${req.params.projectid}`, (err) => {
    //     let temp = []
    //     if (typeof req.body.member == 'string') {
    //       temp.push(`(${req.body.member}, ${id})`)
    //     } else {
    //       for (let i = 0; i < member.length; i++) {
    //         temp.push(`(${member[i]}, ${id})`)
    //       }
    //     }
    //     console.log('Updated');

    //     let input = `INSERT INTO members (userid, projectid)VALUES ${temp.join(",")}`;
    //     pool.query(input, (err) => {
    //       res.redirect('/projects')
    //     })
    //   })
    // });
  });



  router.get('/deleted/:projectid', (req, res) => {
    
    let deleted = parseInt(req.params.projectid)
    let sql1 = `DELETE FROM members WHERE projectid=$1`;
    let sql2 = `DELETE FROM projects WHERE projectid=$1;`
    
    pool.query(sql1, [deleted], (err) => {
      if (err) throw err;
      pool.query(sql2, [deleted], (err) => {
        if (err) throw err;
        console.log('deleted 1 project');
        res.redirect('/projects');
      })
    })
  })





  return router;
};

// module.exports = router;