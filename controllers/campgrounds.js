const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN ;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken}); 
const {cloudinary} = require('../cloudinary');


module.exports.index = async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
}

module.exports.renderNew = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.newCampground = async (req,res,next)=>{
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground); 
    req.flash('success', 'Successfully made a New Campground!!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews', 
        populate:{
            path: 'author'
        }
    })
    .populate('author');
    // console.log(campground);
    if(!campground){
        req.flash('error', "Couldn't find Campground!!!");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.editCampground =  async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imags = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imags);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await campground.save();
    req.flash('success', 'Successfully updated Campground info!!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground =  async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Campground!!');
    res.redirect('/campgrounds');
}

module.exports.renderEdit =  async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', "Couldn't find Campground!!!");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}