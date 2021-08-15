if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
//const catchAsync = require('./utils/cathAsync');
const expressError = require('./utils/expressError');
const campgroundSchema = require('./schemas');
const reviewSchema = require('./schemas2');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users')
//const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')(session);

const dbUrl = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify: false
});


const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Database connected');
})


const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on('error',function(e){
    console.log('SESSION STORE ERROR',e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.user)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeuser',async (req,res)=>{
    const user = await new User({email:'ali@gmail.com' ,username: 'ali' })
    const newUser = await User.register(user,'chickens')
    res.send(newUser)
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(express.static(path.join(__dirname,'public')));





app.get('/',(req,res)=>
{
    res.render('home');
})



app.all('*', (req,res,next)=>{
    next(new expressError('Page not found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}  = err
    if(!err.message){
        err.message = 'Something went wrong!';
    }
    res.status(statusCode).render('partials/error',{err});
})
app.listen(4000, ()=>
{
    console.log('listening on port 3000!');
})