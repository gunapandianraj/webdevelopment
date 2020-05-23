var express     =    require("express"),
    app         =    express(),
    bodyParser  =    require("body-parser"),
    mongoose    =    require("mongoose"),
    campground  =    require("./models/campground"),
    seedDB      =    require("./seeds")
    Comment     =    require("./models/comment")



seedDB();
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});


// campground.create({
//     name: "Granite Hill",
//     image: "",
//     description: "This is greate campground place to visit"
// }, function(err, camp){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(camp);
//     }
// });


app.get("/", function(req, res){
     res.render("landing")
});

app.get("/campgrounds", function(req, res){
    //Get all campgrounds 
    campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }
    });
});

app.post("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res){
    res.render("./campgrounds/new")
});

app.get("/campgrounds/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err){
            console.log(err)
        } else {
            res.render("./campgrounds/show", {campground: foundCampGround});
        }
    });
});


///==========================
/// COMMENTS ROUTES
///===========================

app.get("/campgrounds/:id/comments/new", function(req, res){
    campground.findById(req.params.id, function(err, campData){
        if (err) {
            console.log(err);
        } else {
            console.log(campData)
            res.render("comments/new", {campground: campData});
        }
    })

});

app.post("/campgrounds/:id/comments", function(req, res){

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

app.listen("3000", function(){
 console.log("Yelp camp server started");
});