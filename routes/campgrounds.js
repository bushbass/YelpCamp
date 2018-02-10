var express = require('express');
var router = express.Router();
var Campground = require('../models/campground')

//INDEX - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post('/', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description: desc};
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect('/campgrounds');
        }
    });
});

//NEW - show form to create new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});


//NEW - show form to create new campground
router.get('/:id', (req, res) => {
    // find campgroudn with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
            } else {
                console.log(foundCampground);
                //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });

});

module.exports = router;
