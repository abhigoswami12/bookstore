var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    title: { type: String },
    content: { type: String },
    bookId: { type: Schema.Types.ObjectId, required: true, ref: "Book"},
    author: { type: Schema.Types.ObjectId, required: true, ref: "User"}
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);