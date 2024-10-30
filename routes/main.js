// Create a new router
const express = require("express");
const router = express.Router();



// Handle the main routes
router.get('/',(req,res) => {
    res.render('index.ejs')
 });

 router.get('*', (req, res) => {
    res.status(404).send("<div>404 Not Found</div>");
});



// Export the router object so index.js can access it
module.exports = router;
