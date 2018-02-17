var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');


//Comments NEW
router.get('/new', isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

//Comements create
router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
          Comment.create(req.body.comment, (err, comment) => {
              if (err) {
                  console.log(err);
              } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  campground.comments.push(comment._id);
                  campground.save();
                  console.log(comment._id);
                  res.redirect('/campgrounds/'+campground._id);
              }
          });
        }
    });
});

// Comment edit route
router.get('/:comment_id/edit', function(req, res) {
    Comment.findById(req.params.comment_id, (err, foundComment ) => {
        if(err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    })
})

//Comment update
router.put('/:comment_id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
        res.redirect('back')}
        else{
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


module.exports = router