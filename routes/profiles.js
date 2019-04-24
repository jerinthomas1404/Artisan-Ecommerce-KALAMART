var express = require("express");
var router = express.Router({mergeParams: true});
var Profile = require("../models/profile");
var middleware = require("../middleware");

// Show profiles
router.get("/", function(req, res) {
    Profile.find({}, function(err, allprofiles) {
        if(err) {
            req.flash("error", "profiles could not be loaded!");
            req.redirect("/");
        }
        else {
            res.render("profiles/index", {profiles: allprofiles});
        }
    });
});

// Post New profile Info
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var imageUrl = req.body.imageUrl;
    var category = req.body.category;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newprofile = {title: title, imageUrl: imageUrl, category: category, price: price, description: desc, author: author};
    Profile.create(newprofile, function(err, newDesg) {
        if (err) {
            // req.flash("error", "profile could not be added!");
            // res.redirect("/profiles/new");
            console.log(err);
        } else {
            req.flash("success", "profile added successfully!");
            res.redirect("/profiles");
        }
    });
});

// Show New profile Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("profiles/new");
});

// Show profile Info
router.get("/:id", function(req, res) {
    Profile.findById(req.params.id).populate("reviews").exec(function(err, foundprofile, allprofiles) {
        if (err) {
            console.log("Error here:",err);
        } else {
            res.render("profiles/show", {profile: foundprofile});
        }    
    });
});

// Edit
router.get("/:id/edit", middleware.checkProfileOwnership, function(req, res) {
    Profile.findById(req.params.id, function(err, foundprofile) {
        if(err) {
            req.flash("error", "profile not found!");
            res.redirect("back");
        } else {
            res.render("profiles/edit", {profile: foundprofile});
        }
    });
});

// Update
router.put("/:id", middleware.checkProfileOwnership, function(req, res) {
    Profile.findByIdAndUpdate(req.params.id, req.body.profile, {new: true}, function(err, updatedprofile) {
        if(err) {
            req.flash("error", "profile could not be edited!");
            res.redirect("/profiles");
        } else {
            req.flash("success", "profile edited successfully!");
            res.redirect("/profiles/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:id", middleware.checkProfileOwnership, function(req, res) {
    Profile.findByIdAndRemove(req.params.id, {new: true}, function(err) {
        if(err) {
            req.flash("error", "profile could not be deleted!");
            res.redirect("/profiles");
        }
        else {
            req.flash("success", "profile deleted successfully!");
            res.redirect("/profiles");
        }
    });
});

module.exports = router;