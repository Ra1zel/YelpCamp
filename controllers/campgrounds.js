const Campground = require('../models/campground');
const cloudinary = require('cloudinary')
const mboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mboxGeocoding({accessToken:mapboxToken});
module.exports.index = async(req,res)=>
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
} 

module.exports.renderNewForm =async(req,res)=>
{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>
{
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const camp = new Campground(req.body.campground);
    camp.geometry = geodata.body.features[0].geometry;
    camp.Images = req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.author = req.user._id
    await camp.save();
    req.flash('success','successfully made campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showCampground = async(req,res)=>
{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',populate:{
        path: 'author'
    }}).populate('author');
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditForm = async(req , res)=>
{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground =  async(req,res)=>
{
    const {id} = req.params;
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}));
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    campground.Images.push(...imgs)
    await campground.save()
    console.log(req.body.deleteImages)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
            
        }
        await campground.updateOne({$pull: {Images:{filename:{ $in:req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash('success','successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req,res)=>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground!')
    res.redirect('/campgrounds')
}