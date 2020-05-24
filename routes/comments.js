var express = require("express")
var router = express.Router({mergeParams: true}) // pass params from app js router
var campground = require("../models/campground")
var Comment = require("../models/comment")
///==========================
/// COMMENTS ROUTES
///===========================

router.get("/new",isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, campData){
        if (err) {
            console.log(err);
        } else {
            console.log(campData)
            res.render("comments/new", {campground: campData});
        }
    })

});

router.post("/",isLoggedIn, function(req, res){

    campground.findById(req.params.id, function(err, campData){
        if(err){
            console.log(err)
        } else {
            Comment.create(req.body.Comment, function(err, data){
                if(err){
                    console.log(err)
                } else {
                    campData.comments.push(data._id);
                    campData.save();
                    res.redirect("/campgrounds/" + campData._id)
                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.render("login");
 }

module.exports = router;