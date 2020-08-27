var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    name: { type: String},
    email: { type: String, required: true, unique: true },
    username: { type: String},
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
    providers: [ String ]
}, { timestamps: true });


userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", userSchema);
