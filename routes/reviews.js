var express = require("express");
var router = express.Router({mergeParams: true});
var Product = require("../models/product");
var Profile = require("../models/profile");
var Review = require("../models/review");
var middleware = require("../middleware");

// reviews
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Product.findById(req.params.id, function(err, product) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/new", {product: product});
        }
    });
});

router.post("/", function(req, res) {
    Product.findById(req.params.id, function(err, product) {
        if(err) {
            console.log(err);
            res.redirect("/products");
        } else {
            Review.create(req.body.review, function(err, review) {
                if (err) {
                    console.log(err);
                } else {
                    // Add Username to review
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    review.save();
                    product.reviews.push(review);
                    product.save();
                    req.flash("success", "Review added successfully!");
                    res.redirect("/products/" + product._id)
                }            
            });
        }
    })
});

router.post("/", function(req, res) {
    Profile.findById(req.params.id, function(err, product) {
        if(err) {
            console.log(err);
            res.redirect("/profiles");
        } else {
            Review.create(req.body.review, function(err, review) {
                if (err) {
                    console.log(err);
                } else {
                    // Add Username to review
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    review.save();
                    product.reviews.push(review);
                    product.save();
                    req.flash("success", "Review added successfully!");
                    res.redirect("/profiles/" + product._id)
                }            
            });
        }
    })
});


// Edit
router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("reviews/edit", {product_id: req.params.id, review: foundReview});
        }
    });
});


// Update
router.put("/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Review edited successfully!");
            res.redirect("/products/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "review deleted successfully!");
            res.redirect("/products/" + req.params.id);
        }
    });
});

module.exports = router;