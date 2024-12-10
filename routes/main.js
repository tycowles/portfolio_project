// Create a new router
const express = require("express");
const router = express.Router();

var data = {companyName: "Uni-Helper"}

router.get('/',(req,res) => {
    res.render('index.ejs')
 });

router.get('/about',function(req,res){
    res.render('about.ejs', data);
});

 router.get('/register',(req,res) => {
    res.render('register.ejs')
 });

router.get('/addProduct', function (req,res) {
    res.render('addProduct.ejs', data);                                                                     
}); 

router.get('/searchProduct', function (req,res) {
    res.render('searchProduct.ejs', data);                                                                     
}); 
  
router.get('/showProduct', function (req,res) {
    let sqlquery2 = "SELECT * FROM categories";
    db.query(sqlquery2, (err, results) => {
        if (err) {
            return console.error(err.message);
        } else {
            let newData = Object.assign({}, data, {display:false}, {category:results});
            res.render("showProduct.ejs", newData);
        }
        
    });                                                                      
}); 
  
router.post('/registered', function (req,res) {
    // saving data in database
    let sqlquery = "INSERT INTO users (name, email, password) VALUES (?, ?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.email, req.body.password];
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
    let newData = Object.assign({}, data, {repeat:false});
    res.render("login.ejs", newData);
});

router.get('/retrylogin',(req,res) => {
    let newData = Object.assign({}, data, {repeat:true});
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
            res.redirect("/showPage?user_id=" + result[0].user_id + "&name=" + result[0].name);
            }
            else {
            res.redirect("/retrylogin");
            } 
        }
    });
}); 

router.get('/showPage', function (req,res) {
    
    let sqlquery2 = "SELECT * FROM products WHERE user_id = ?";
    let keyword = [req.query.user_id];

    db.query(sqlquery2, keyword, (err, books) => {
        if (err) {
            res.redirect('./'); 
        } else {
            let sqlquery2 = "SELECT * FROM categories";
            db.query(sqlquery2, (err, results) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    let newData = Object.assign({}, data, {user_id:req.query.user_id}, {products:books}, {display:false}, {category:results});
                    res.render("loggedin.ejs", newData);
                }
                
            });             
        }
    });                                                            
}); 
  



router.post('/productadded', function (req,res) {
    let sqlquery = "INSERT INTO products (name, description, price, user_id, cat_id) VALUES (?,?,?,?,?)";
    let newrecord = [req.body.name, req.body.description, req.body.price, req.body.user_id, req.body.category];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            console.log("success!");
            res.redirect("/showPage?user_id=" + req.body.user_id);
        }
    });
}); 

router.post('/deleteProduct', function (req,res) {
    // saving data in database
    let sqlquery = "DELETE FROM products WHERE product_id = ?;";
    // execute sql query
    let newrecord = [req.body.product_id];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            console.log("success!");
            res.redirect("/showPage?user_id=" + req.body.user_id);
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

    let sqlquery2 = "SELECT * FROM categories";
    db.query(sqlquery2, (err, results) => {
        if (err) {
            return console.error(err.message);
        } else {

            let sqlquery = "SELECT * FROM products WHERE cat_id = ?";
            // execute sql query
            let keyword = [req.query.category];

            db.query(sqlquery, keyword, (err, products) => {
                if (err) {
                    res.redirect('./'); 
                }
                console.log(products);
                let newData = Object.assign({}, data, {display:true}, {category:results}, {product:products});
                res.render("showProduct.ejs", newData);
            });

            
        }
        
    });
});

router.get('*', (req, res) => {
    res.status(404).send("<div>404 Not Found</div>");
});

// Export the router object so index.js can access it
module.exports = router;
