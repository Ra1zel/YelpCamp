const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.deleteReview = async(req,res)=>
{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`);

}
module.exports.createReview = async(req,res)=>{
    const c = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)
    review.author = req.user._id;
    c.reviews.push(review);
    await review.save()
    await c.save()
    req.flash('success','successfully posted review')
    res.redirect(`/campgrounds/${c._id}`)
}