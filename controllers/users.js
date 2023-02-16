const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.registerUser = async (req,res)=>{
    try {
        const {username,email,password} =  req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err){
            if(err) next(err);
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) =>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Log Out Successful!!');
        res.redirect('/campgrounds');
    })
}

