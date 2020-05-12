var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
var campgrounds = [
    {name: "Salemm creek", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Mountain Goats rest", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Salemm creek", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Mountain Goats rest", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Salemm creek", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"},
    {name: "Mountain Goats rest", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e5074417c2e78d19145c7_340.jpg"}
]

app.get("/", function(req, res){
     res.render("landing")
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds})
});

app.post("/campgrounds", function(req, res){
     console.log(req.body)
     var name = req.body.name;
     var image = req.body.image;
     var newCampgrounds = { name: name, image: image }
     campgrounds.push(newCampgrounds);

     res.redirect("/campgrounds")
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
});

app.listen("3000", function(){
 console.log("Yelp camp server started");
});