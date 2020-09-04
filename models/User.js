var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var path = require('path');
var defaultImgPath = path.join(__dirname, "../", "public/images/bookshelf-svgrepo-com.svg")

var userSchema = new Schema(
  {
    image: { type: String},
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String },
    github: {
      name: String,
      username: String,
      image: String
    },
    google: {
      name: String,
      image: String
    },
    providers: [String],
    isAdmin: { type: Boolean, default: false },
    cartId: {type: Schema.Types.ObjectId, ref: "Cart"},
    favourites: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    isBlocked: { type: Boolean, default: false}
  },
  { timestamps: true }
);


userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});
userSchema.pre('save', function(next) {
    if(this.email == "abhigoswami296@gmail.com" || this.email == "golugosu157@gmail.com") {
        this.isAdmin = true;
        
    }
    next();

})

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", userSchema);
