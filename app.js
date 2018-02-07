var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require ('./seeds')
var Comment = require('./models/comment')


mongoose.connect("mongodb://bushbass:bd3snd@ds117868.mlab.com:17868/yelp-camp")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
seedDB();
        
app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


//NEW - show form to create new campground
app.get('/campgrounds/:id', (req, res) => {
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



// ========================
// COMMENTS ROUTES
// ========================

app.get('/campgrounds/:id/comments/new', (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
          Comment.create(req.body.comment, (err, comment) => {
              if (err) {
                  console.log(err)
              } else {
                  campground.comments.push(comment._id);
                  campground.save();
                  res.redirect('/campgrounds/'+campground._id)
              }
          })
    // connect new commment to campground
    // redirect to show page of campgrounds show page
      
        }
    })
    
})

app.listen(process.env.PORT, process.env.IP, () =>{
    console.log('server has started');
})