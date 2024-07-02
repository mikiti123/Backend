const mongoose = require('mongoose');

const ArtykulySchema = new mongoose.Schema({
       nazwa :{
        type : String,
       },
       cena: Number,
       jednostka:{
        type:String,
       },
       rodzaj:{
        type:String,
       }
},{
    collection:'artykuły'
});
module.exports = mongoose.model("artykuły",ArtykulySchema);