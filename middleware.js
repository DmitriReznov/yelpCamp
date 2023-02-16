const Campground = require("./models/campground");
const Review = require("./models/review")
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema,reviewSchema} = require('./schemas');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please Login First!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    const {error:err} = campgroundSchema.validate(req.body);
    if(err){
        const msg = err.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
       next();
    }
}

module.exports.isAuthor = async (req,res,next) => {
   const {id} = req.params;
   const campground = await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
      req.flash('error','Permission Denied, you are not the author');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewid} = req.params;
    const review = await Review.findById(reviewid);
    if(!review.author.equals(req.user._id)){
       req.flash('error','Permission Denied, you are not the author');
       return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }

module.exports.validateReview = (req,res,next) => {
    const {error:err} = reviewSchema.validate(req.body);
    if(err){
        const msg = err.details.map( el => el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
       next();
    }
}