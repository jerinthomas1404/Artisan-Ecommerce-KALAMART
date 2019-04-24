var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var middleware = require("../middleware");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// var options = {
//   auth: {
//     api_user: 'kalamart',
//     api_key: process.env.SENDGRID_API_KEY
//   }
// };
// var client = nodemailer.createTransport(sgTransport(options));

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register",function(req,res){
    let ema_il = req.body.email;
    let username = req.body.username;
 
// var email = {
//   from: 'seacomp17@gmail.com',
//   to: ema_il,
//   subject: 'Hello',
//   text: 'Hello world',
//   html: '<b>Hello world</b>'
// };

// client.sendMail(email, function(err, info){
//     if (err ){
//       console.log(err);
//     }
//     else {
//       console.log('Message sent: ' + info.response);
//     }
// });
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to KalaMart, " + user.username);
            res.redirect("/");
        });
    });
})

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out Successfully!");
    res.redirect("/");
});

router.post("/cart", middleware.isLoggedIn, function(req, res) {
    var quantity = req.body.quantity;
    var productId = req.body.id;
    console.log(quantity);
    console.log(productId);
    var newItem = {quantity: quantity, productId: productId};
    console.log(newItem);
    req.user.addToCart(newItem);
    res.render('cart',{cartitems:newItem});
})

router.get("/about", function(req, res) {
    res.render("about");
})

router.get("/checkout", function(req, res) {
    res.render("checkout");
})

router.get("/contact", function(req, res) {
    res.render("contact");
})
router.get("/videos", function(req, res) {
    res.render("vids");
});
// router.get("/profile", function(req, res) {
//     res.render("profile");
// })
module.exports = router;