var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
// var path = require('path');
// var defaultImgPath = path.join(__dirname, "../", "public/images/bookshelf-svgrepo-com.svg")

var bookSchema = new Schema(
    {
        image: { type: String },
        title: { type: String, required: true },
        author: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String},
        category: [{type: String }],
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review"}]
    },
    { timestamps: true }
);


module.exports = mongoose.model('Book', bookSchema);