const User = require('../models/user');


module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res)=>{
    try{
        const {username, password, email} = req.body;
        const user = await new User({username,email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err){
                return next(err)
            }
            req.flash('success','Welcome to Yelpcamp!')
            res.redirect('/campgrounds')
        })

    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.login = async(req, res )=>{
    const returnUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    req.flash('success','Welcome back!')
    res.redirect(returnUrl)
}

module.exports.logout = (req,res)=>{
    req.logOut()
    req.flash('success','Logged you out successfully')
    res.redirect('/campgrounds')
}