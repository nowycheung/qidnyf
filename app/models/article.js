// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Items = new Schema({
    id: String,
    brand: String,
    description: String,
    price: String,
    count: String,
    img: String
});

var Costumer = new Schema({
    id: String,
    name: String,
    email: String,
    cart: []
});

mongoose.model('Items', Items);
mongoose.model('Costumer', Costumer);
