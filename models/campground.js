const mongoose = require('mongoose');
const Review = require('./review');
const {Schema} = mongoose;

const ImageSchema = new Schema({
   url: String,
   filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_300');
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = Schema({
    title : String,
    price: Number,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
       type: Schema.Types.ObjectId,
       ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)

campgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`;
})

campgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({
            _id:{
                $in: campground.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground',campgroundSchema);
module.exports = Campground;