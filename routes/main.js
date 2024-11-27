// Create a new router
const express = require("express");
const router = express.Router();

var shopData = {shopName: "Bertie's Books"}


// Handle the main routes
router.get('/',(req,res) => {
    res.render('index.ejs')
 });

router.get('/about',function(req,res){
    res.render('about.ejs', shopData);
});

// router.get('/search',function(req,res){
//     res.render("search.ejs", shopData);
// });

 router.get('/register',(req,res) => {
    res.render('register.ejs')
 });

router.get('/addProduct', function (req,res) {
    res.render('addProduct.ejs', shopData);                                                                     
}); 
  
router.get('/showProduct', function (req,res) {
    res.render('showProduct.ejs', shopData);                                                                     
}); 
  
router.post('/registered', function (req,res) {
    // saving data in database
    let sqlquery = "INSERT INTO users (email, password) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.email, req.body.password];
    db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    else {
        res.send(' This user is added to database, email: '
                + req.body.email);
    }
    });
}); 

router.get('/login',(req,res) => {
    let newData = Object.assign({}, shopData, {repeat:false});
    res.render("login.ejs", newData);
 });

 router.get('/retrylogin',(req,res) => {
    let newData = Object.assign({}, shopData, {repeat:true});
    res.render("login.ejs", newData);
 });

 router.post('/loggedin', function (req,res) {
    // saving data in database
    let sqlquery = "SELECT * FROM users WHERE email = ?";
    // execute sql query
    let newrecord = [req.body.email];
    db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    else {
        if (result.length != 0 && result[0].password == req.body.password) {
            let sqlquery2 = "SELECT * FROM products WHERE user_id = ?";
            // execute sql query
            console.log(result[0].id);
            let keyword = [result[0].id];
        
            db.query(sqlquery2, keyword, (err, books) => {
            if (err) {
                res.redirect('./'); 
            } else {
                let newData = Object.assign({}, shopData, {id:result[0].id}, {products:books});
                res.render("loggedin.ejs", newData);
            }
            });
        }
        else {
            res.redirect("/retrylogin");
        }
    }
    });
}); 



router.post('/productadded', function (req,res) {
    // saving data in database
    let sqlquery = "INSERT INTO products (user_id, name, description, price) VALUES (?,?,?,?)";
    // execute sql query
    let newrecord = [req.body.user_id, req.body.name, req.body.description, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      else {
        res.send(' This product is added to database, name: '
                  + req.body.name + ' description '+ req.body.description + ' price '+ req.body.price);
      }
    });
}); 
  
  router.get('/search-result', function (req,res) {
      // saving data in database
      let sqlquery = "SELECT * FROM books WHERE name = ?";
      // execute sql query
      let keyword = [req.query.keyword];
      console.log(req.query.keyword);
  
      db.query(sqlquery, keyword, (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        else {
          res.send(' We do have this book, name: '
                    + result[0].name + ' price '+ result[0].price);
        }
      });
  }); 
  
  router.get('/showResult', function (req,res) {
    // saving data in database
    let sqlquery = "SELECT * FROM products WHERE user_id = ?";
    // execute sql query
    let keyword = [req.query.user_id];
    console.log(req.query.keyword);
  
    db.query(sqlquery, keyword, (err, result) => {
      if (err) {
        res.redirect('./'); 
      }
      //res.send(result)
      let newData = Object.assign({}, shopData, {products:result});
        console.log(newData)
        res.render("showResult.ejs", newData)
    });
  });

router.get('*', (req, res) => {
    res.status(404).send("<div>404 Not Found</div>");
});



// Export the router object so index.js can access it
module.exports = router;
