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
                    data.author.id = req.user._id;
                    data.author.username = req.user.username;
                    data.save()
                    campData.comments.push(data._id);
                    campData.save();
                    res.redirect("/campgrounds/" + campData._id)
                }
            });
        }
    });
});


router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, data) {
        res.render("comments/edit", {campgroundid: req.params.id, comment: data})

    })
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.render("login");
 }

module.exports = router;