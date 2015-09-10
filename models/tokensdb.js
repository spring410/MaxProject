/**
 * Created by sam on 9/10/2015.
 */

var mongoose = require('./basedb').db;
var constant = require('./constant');

var Schema = mongoose.Schema;
var TokensSchema = new Schema({
    token : String,
    account: String,
    create_date : {type: Date, default: Date.now},
    expire_date:  {type: Date, default: Date.now}
});
var TokenCollectionName = 'tokens';
mongoose.model(TokenCollectionName, UsersSchema);
var Tokens = mongoose.model(TokenCollectionName);
