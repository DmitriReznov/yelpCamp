const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.newReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added your review!!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Successfully deleted the review!!');
    res.redirect(`/campgrounds/${id}`);
}