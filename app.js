var express = require("express"),
mongoose = require("mongoose"),
passport = require("passport"),
paypal = require("paypal-rest-sdk"),
bodyParser = require("body-parser"),
passportLocal = require("passport-local"),
methodOverride = require("method-override"),
flash = require("connect-flash"),
express = require("express"),
app = express();

// Database
mongoose.connect("mongodb://localhost/kala-mart", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

// Payment
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Acq6o6hrLTOS67A4caohHeaBzGkqmB3SSvAkW611BGetcxK417C4br-FUpxkIbWLHJwoCswKFfOZWnN-',
  'client_secret': 'ELJVmkBfj7-kd6JTWW_trl0hyDXLqVJQeJwfTMZXUPxixGhUFdxduQ8tFclOXGacyVwlyLCpncOHh-ts'
});

app.post("/pay", function(req, res) {
    const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "https://artisan-ecommerce-sovinnour.c9users.io/success",
        "cancel_url": "https://artisan-ecommerce-sovinnour.c9users.io/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": 'Jaipur Blue Pottery',
                "sku": "item",
                "price": 2800,
                "currency": "INR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "INR",
            "total": 2800
        },
        "description": 'Tea Set in Jaipur Blue Pottery'
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i=0; i<payment.links.length; i++) {
            if(payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href);
            }
        }
    }
});
})

app.get("/success", function(req, res) {
    const payerID = req.query.PayerID;
    const paymentID = req.query.paymentId;
    
    const execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
            "amount": {
                "currency": "INR",
                "total": 500
            }
        }]
    }
    
    paypal.payment.execute(paymentID, execute_payment_json, function(err, payment) {
        if(err) {
            throw err;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
        }
    })
})

app.get('/cancel', function(req, res) {
    res.send("Cancelled!");
})

// Models
var Product = require("./models/product"),
User = require("./models/user"),
Review = require("./models/review"),
Profile = require("./models/profile");

// Routes
var productRoutes = require("./routes/products"),
reviewRoutes = require("./routes/reviews"),
indexRoutes = require("./routes/index"),
profileRoutes = require("./routes/profiles");

// Default Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Config
app.use(require("express-session")({
    secret: "abc",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routing
app.use(indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/profiles", profileRoutes);
app.use("/profiles/:id/reviews", profileRoutes);
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("KalaMart Server is Active!");
});