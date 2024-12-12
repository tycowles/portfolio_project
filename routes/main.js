// Create a new router
const express = require("express");
const router = express.Router();

// sets the company name
var data = {companyName: "Uni-Helper"}

// displays the home page
router.get('/',(req,res) => {
    res.render('home.ejs', data)
 });

 // displays the about page
router.get('/about',function(req,res){
    res.render('about.ejs', data);
});

// displays the register page
router.get('/register',(req,res) => {
    res.render('register.ejs', data)
});
  
// displays the showProduct page which is the search page
router.get('/showProduct', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery2 = "SELECT * FROM categories";
    
    // query the db
    db.query(sqlquery2, (err, results) => {
        if (err) {
            return console.error(err.message);
        } else {
            // save data from the db and send them to the page render
            let newData = Object.assign({}, data, {display:false}, {category:results});
            res.render("showProduct.ejs", newData);
        }
        
    });                                                                      
}); 
  
// handles adding users into the database
router.post('/registered', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery = "INSERT INTO users (name, email, password) VALUES (?, ?,?)";
    let newrecord = [req.body.name, req.body.email, req.body.password];
    
    // query the db
    db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    else {
        // redirect to a different route
        res.redirect("login");
    }
    });
}); 

// displays the login page
router.get('/login',(req,res) => {
    let newData = Object.assign({}, data, {repeat:false});
    res.render("login.ejs", newData);
});

// displays the login page after a failed attempt
router.get('/retrylogin',(req,res) => {
    let newData = Object.assign({}, data, {repeat:true});
    res.render("login.ejs", newData);
});

// handles login in feature and checks if credentials are correct
router.post('/loggedin', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery = "SELECT * FROM users WHERE email = ?";
    let newrecord = [req.body.email];

    // query the db
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            if (result.length != 0 && result[0].password == req.body.password) {
                // redirect to a different route
                res.redirect("showPage?user_id=" + result[0].user_id + "&name=" + result[0].name);
            }
            else {
                // redirect to a different route
                res.redirect("retrylogin");
            } 
        }
    });
}); 

// displays the showPage which loads the user's personal account
router.get('/showPage', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery2 = "SELECT * FROM products WHERE user_id = ?";
    let keyword = [req.query.user_id];

    // query the db
    db.query(sqlquery2, keyword, (err, books) => {
        if (err) {
            res.redirect('./'); 
        } else {
            // sets the query for the database to retrieve data
            let sqlquery2 = "SELECT * FROM categories";
            
            // query the db
            db.query(sqlquery2, (err, results) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    // save data from the db and send them to the page render
                    let newData = Object.assign({}, data, {user_id:req.query.user_id}, {products:books}, {display:false}, {category:results});
                    res.render("loggedin.ejs", newData);
                }
                
            });             
        }
    });                                                            
}); 

// inserts a new listing into the database and refreshes the page to show the new product
router.post('/productadded', function (req,res) {
    // sets the query for the database to insert data
    let sqlquery = "INSERT INTO products (name, description, price, user_id, cat_id) VALUES (?,?,?,?,?)";
    let newrecord = [req.body.name, req.body.description, req.body.price, req.body.user_id, req.body.category];
    
    // query the db
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            // redirect to a different route
            res.redirect("showPage?user_id=" + req.body.user_id);
        }
    });
}); 


// removes a listing from the database and refreshes the page to show the change
router.post('/deleteProduct', function (req,res) {
    // sets the query for the database to remove data
    let sqlquery = "DELETE FROM products WHERE product_id = ?;";
    let newrecord = [req.body.product_id];
    
    // query the db
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            // redirect to a different route
            res.redirect("showPage?user_id=" + req.body.user_id);
        }
    });
}); 

// displays the search results after filtering based on subject/category
router.get('/showResult', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery2 = "SELECT * FROM categories";
    
    // query the db
    db.query(sqlquery2, (err, results) => {
        if (err) {
            return console.error(err.message);
        } else {
            // sets the query for the database to retrieve data
            let sqlquery = "SELECT * FROM products WHERE cat_id = ?";
            let keyword = [req.query.category];

            // query the db
            db.query(sqlquery, keyword, (err, products) => {
                if (err) {
                    res.redirect('./'); 
                }
                // save data from the db and send them to the page render
                let newData = Object.assign({}, data, {display:true}, {category:results}, {product:products}, {searchCat:results[req.query.category - 1].name}, {cat_id:req.query.category});
                res.render("showProduct.ejs", newData);
            });

            
        }
        
    });
});

// displays the enquire page which shows the sellers contact info
router.get('/enquire', function (req,res) {
    // sets the query for the database to retrieve data
    let sqlquery = "SELECT p.name, p.description, p.price, u.email FROM products p LEFT JOIN users u ON p.user_id = u.user_id WHERE p.product_id = ?";
    let keyword = [req.query.product_id];

    // query the db
    db.query(sqlquery, keyword, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            // save data from the db and send them to the page render
            let newData = Object.assign({}, data, {product:result}, {cat_id:req.query.cat_id});
            res.render("enquire.ejs", newData);
        }
    });
});

// handles incorrect urls
router.get('*', (req, res) => {
    res.status(404).send("<div>404 Not Found</div>");
});

// Export the router object so index.js can access it
module.exports = router;
