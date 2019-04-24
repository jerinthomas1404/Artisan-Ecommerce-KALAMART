var express = require("express");
var router = express.Router({mergeParams: true});
var Product = require("../models/product");
var middleware = require("../middleware");
// Show Products
router.get("/", function(req, res) {
    Product.find({}, function(err, allProducts) {
        if(err) {
            req.flash("error", "Products could not be loaded!");
            req.redirect("/");
        }
        else {
            res.render("products/index", {products: allProducts});
        }
    });
});

// Post New Product Info
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
    var newProduct = {title: title, imageUrl: imageUrl, category: category, price: price, description: desc, author: author};
    Product.create(newProduct, function(err, newDesg) {
        if (err) {
            req.flash("error", "Product could not be added!");
            res.redirect("/products/new");
        } else {
            req.flash("success", "Product added successfully!");
            res.redirect("/products");
        }
    });
});

// Show New Product Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("products/new");
});
// Show Product Info
router.get("/:id",function(req, res) {
    Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct){
        if (err) {
            console.log(err);
        } else {
            var cat=foundProduct.category
            Product.find({category: cat}).exec(function(err, catProducts) {
        if (err) {
            console.log("Not working");
        }
        else{
            console.log(catProducts);
            var items={product:foundProduct, categ:catProducts}
            res.render("products/show", {items: items} );
        }
    })
            // res.render("products/show", {product: foundProduct, cate: catProducts});
        }    
    });
});
//POST
// router.post('/:id',function(req,res,next){
//     currentUser.
// });


// Edit
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if(err) {
            req.flash("error", "Product not found!");
            res.redirect("back");
        } else {
            res.render("products/edit", {product: foundProduct});
        }
    });
});

// Update
router.put("/:id", middleware.checkProductOwnership, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.Product, {new: true}, function(err, updatedProduct) {
        if(err) {
            req.flash("error", "Product could not be edited!");
            res.redirect("/products");
        } else {
            req.flash("success", "Product edited successfully!");
            res.redirect("/products/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:id", middleware.checkProductOwnership, function(req, res) {
    Product.findByIdAndRemove(req.params.id, {new: true}, function(err) {
        if(err) {
            req.flash("error", "Product could not be deleted!");
            res.redirect("/products");
        }
        else {
            req.flash("success", "Product deleted successfully!");
            res.redirect("/products");
        }
    });
});



module.exports = router;