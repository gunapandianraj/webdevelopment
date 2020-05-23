var express     =    require("express"),
    app         =    express(),
    bodyParser  =    require("body-parser"),
    mongoose    =    require("mongoose"),
    campground  =    require("./models/campground"),
    seedDB      =    require("./seeds"),
    Comment     =    require("./models/comment"),
    passport    =    require("passport"),
    LocalStrategy =  require("passport-local"),
    User         =   require("./models/user")


seedDB();
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(require("express-session")({
    secret: "someonerandomworld",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user})
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

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, campData){
        if (err) {
            console.log(err);
        } else {
            console.log(campData)
            res.render("comments/new", {campground: campData});
        }
    })

});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){

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



//Show register form

app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register")
        }

        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        }); 
    });
});

//Show login forum:
app.get("/login", function(req, res){
    res.render("login")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
   
});

app.get("/logout", function(req, res){
    req.logOut()
    res.redirect("/campgrounds")
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.render("login");
}

app.listen("3000", function(){
 console.log("Yelp camp server started");
});