var express = require("express")
var router = express.Router()
var campground = require("../models/campground")



router.get("/", function(req, res){
    //Get all campgrounds 
    campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user})
        }
    });
});

router.post("/",isLoggedIn, function(req, res){
     console.log(req.body)
     var name = req.body.name;
     var image = req.body.image;
     var id = String(req.user._id)
     var author = { 
                id: id, 
                username: req.user.username 
          }

     var newCampgrounds = new campground({ name: name, image: image, author: author })
    
     newCampgrounds.save(function(err, camp){
        if (err) {
            console.log(err)
        } else {
            console.log(camp)
            res.redirect("campgrounds")
        }
     });
     
});

router.get("/new",isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

router.get("/:id",isLoggedIn,  function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err){
            console.log(err)
        } else {
            console.log(__dirname)
            res.render("campgrounds/show", {campground: foundCampGround});
        }
    });
});

//Edit route
router.get("/:id/edit",checkCampgroundOwnership, function(req, res){

        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                 res.redirect("camground")
            } else {
                 res.render("campgrounds/edit",{ campground: foundCampground});
            } 
         });
});

router.put("/:id",checkCampgroundOwnership, function(req, res){
    console.log(req.body.campground)
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

//Destroy
router.delete("/:id",checkCampgroundOwnership, function(req, res){
    console.log(req.params.id)
  campground.findByIdAndRemove(req.params.id, function(err){
    res.redirect("/campgrounds")
  });
});



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.render("login");
 }

 function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                 res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                   next();
                } else {
                    res.redirect("back")
                }
            } 
         });
    } else {
        res.redirect("back")
    }
 }
module.exports = router;