var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
  booksId: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  itemsInCart: { type: Number, default: 0 }
});


module.exports = mongoose.model("Cart", cartSchema);