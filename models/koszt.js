const mongoose = require("mongoose");

const kosztSchema = new mongoose.Schema({
    cena : Number,
    id_zam:String    
});
module.exports = mongoose.model("koszt",kosztSchema);