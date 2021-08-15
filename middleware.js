const expressError = require('./utils/expressError');
const campgroundSchema = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const reviewSchema = require('./schemas2')


module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in for this action')
        return res.redirect('/login')
    }
    next()
}



module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message ).join(',');
        throw new expressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id}= req.params;
    const campground =await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','you do not have permission to perform this action')
        res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}= req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permission to perform this action')
        res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    console.log('reviewSchema')
    if(error){
        const msg = error.details.map(el=> el.message ).join(',');
        throw new expressError(msg,400)
    }
    else{
        next();
    }
}
