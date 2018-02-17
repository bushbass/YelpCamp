// all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership =(req, res, next) => {
     // is user logged in
    if (req.isAuthenticated()){
         Campground.findById(req.params.id, (err, foundCampground)=> {
            if(err) {
                res.redirect('/campgrounds');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back')
                }
            }
         });
    } else {
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = middlewareObj;





function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

