const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const seedHelpers = require('./titles');
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Database connected');
})

const getTitlePart= (array)=>array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000); 
        const loc = `${cities[random1000].city} ${cities[random1000].state}`;
        const randPrice = Math.floor(Math.random()*20 +10);
        const title1 = getTitlePart(seedHelpers.descriptors);
        const title2 = getTitlePart(seedHelpers.places);
        const titleFull = `${title1} ${title2}`;
        let camp = new Campground({
            author: '61156ae9e1188c20a992f106',
            title:titleFull,
            location: loc,
            price: randPrice,
            geometry: { "type" : "Point", "coordinates" : [cities[random1000].longitude,
            cities[random1000].latitude] },
            Images: [ {"url" : "https://res.cloudinary.com/degnwdcr9/image/upload/v1628964596/YelpCamp/wd8rtgy26xciovdnupvy.jpg", "filename" : "YelpCamp/wd8rtgy26xciovdnupvy" }, { "url" : "https://res.cloudinary.com/degnwdcr9/image/upload/v1628964613/YelpCamp/hgr54qxqxqm0of1vxfsh.jpg", "filename" : "YelpCamp/hgr54qxqxqm0of1vxfsh" } ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis eligendi illum quaerat cupiditate, amet tempora officia possimus voluptate neque earum eaque, rem cum ad facere ut odio, fugit necessitatibus. Ipsum.'
        })
        await camp.save();
    }

};
seedDB().then(()=>{
    mongoose.connection.close();
})