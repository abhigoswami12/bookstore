var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
// var path = require('path');
// var defaultImgPath = path.join(__dirname, "../", "public/images/bookshelf-svgrepo-com.svg")

var bookSchema = new Schema(
    {
        image: { type: String },
        name: { type: String, required: true },
        author: { type: String, required: true },
        price: { type: Number, required: true },
        dscription: { type: String},
        Category: [{type: String }]
    },
    { timestamps: true }
);


module.exports = mongoose.model('Book', bookSchema);