var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UsersSchema = new Schema({
    name : String,
    email: String,
    phone:String,
    thirdparty:Number,
    signuptype:Number,
    signupdate:{ type: Date, default: Date.now},
    sex:Number,
    avatar:Number,
    alias : [String],
    publish : Date,
    create_date : { type: Date, default: Date.now}
});
var Users = mongodb.mongoose.model("Users", UsersSchema);



var UsersDAO = function(){};
module.exports = new UsersDAO();