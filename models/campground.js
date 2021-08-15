const mongoose = require('mongoose');
const Review = require('./review')
const User = require('./user')
const schema = mongoose.Schema;


const ImageSchema = new schema({
    url:String,
    filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload' , '/upload/w_400');
});

const opts = {toJSON:{virtuals:true }}
const campgroundSchema = new schema(
    {
        title: String,
        price: Number,
        description: String,
        location: String,
        geometry: {
            type: {
              type: String,
              enum: ['Point'],
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
        },
        Images:[ImageSchema],
        author: {
            type: schema.Types.ObjectId,
            ref: 'User'
        },
        reviews:[{
            type: schema.Types.ObjectId , ref:'Review'
        }]
    },opts);

campgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})
campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    
})
module.exports = mongoose.model('Campground', campgroundSchema);