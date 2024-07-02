const mongoose = require('mongoose');
const article = require('./Artykuly');

const subschema = new mongoose.Schema({
    nazwa: String,
    ilość: Number
});

const zamowienia = new mongoose.Schema({
       id :{
        type : String,
       },
       login_klienta:{
        type:String,
       },
       kupione:[subschema],
       data : {
        type: Date,
        default:()=>Date.now()
       }
}
);
module.exports = mongoose.model("zamowienia",zamowienia);