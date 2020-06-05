var express     =    require("express"),
    app         =    express(),
    bodyParser  =    require("body-parser"),
    mongoose    =    require("mongoose"),
    methodOverride = require("method-override"),
    seedDB      =    require("./seeds"),
    passport    =    require("passport"),
    LocalStrategy =  require("passport-local"),
    User         =   require("./models/user")
   

var commentsRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index")

seedDB();
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(methodOverride("_method"));
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

//Middleware to be called before all routes.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen("3000", function(){
 console.log("Yelp camp server started");
});