const mongoose = require('mongoose');

const CookieSchema = new mongoose.Schema({
       name :{
        type : String,
        required : true
       },
       value:{
        type: String,
        required: true
       },
       login: String
});
module.exports = mongoose.model("Cookie",CookieSchema);