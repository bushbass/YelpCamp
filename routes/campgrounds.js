var express = require('express');
var router = express.Router();
var Campground = require('../models/campground')
var middleware = require('../middleware')

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
router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
         var author = {
             id: req.user._id,
             username: req.user.username
         }
    var newCampground = {name:name, image:image, description: desc, author:author};
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect('/campgrounds');
        }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});


//SHOW shows more info about one campground
router.get('/:id', (req, res) => {
    // find campgroudn with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back')
            } else {
                console.log(foundCampground);
                //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });

// Edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    // is user logged in
         Campground.findById(req.params.id, (err, foundCampground)=> {
             if(err) {
                 console.log(err)
             }else {
                  res.render('campgrounds/edit', {campground: foundCampground});
             }
           
    });
});

// Update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  //find and update correct camprgound
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
      if(err) {
          res.redirect('/campgrounds');
      } else {
          res.redirect('/campgrounds/' + req.params.id);
      }
  })
  //redirect somwhere( show page)
})

});

//Destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router;
