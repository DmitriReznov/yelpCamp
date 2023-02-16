const Campground = require('../models/campground');
const mongoose = require('mongoose');
const {places,descriptors} = require('./seedHelpers');
const cities = require('./cities')
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const randomIndex = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '63c0faef3ef7ade566f44f0f',
            location: `${cities[randomIndex].city}, ${cities[randomIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'lorem Ipsum',
            price,
            geometry: { type: 'Point', 
            coordinates: [ cities[randomIndex].longitude, cities[randomIndex].latitude] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/di1hfjc4h/image/upload/v1673808212/YelpCamp/porytwnrudlrds3ughiu.jpg',
                  filename: 'YelpCamp/porytwnrudlrds3ughiu',
                },
                {
                  url: 'https://res.cloudinary.com/di1hfjc4h/image/upload/v1673808214/YelpCamp/xwu7vxxq5uy02rpgufg0.jpg',
                  filename: 'YelpCamp/xwu7vxxq5uy02rpgufg0',
                }
              ]
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
  mongoose.connection.close();
})