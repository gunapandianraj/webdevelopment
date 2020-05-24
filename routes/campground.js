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

router.post("/", function(req, res){
     console.log(req.body)
     var name = req.body.name;
     var image = req.body.image;
     var newCampgrounds = new campground({ name: name, image: image })
    
     newCampgrounds.save(function(err, camp){
        if (err) {
            console.log(err)
        } else {
            console.log(camp)
        }
     });
     res.redirect("./campgrounds/index")
});

router.get("/new", function(req, res){
    res.render("./campgrounds/new")
});

router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err){
            console.log(err)
        } else {
            res.render("./campgrounds/show", {campground: foundCampGround});
        }
    });
});


module.exports = router;