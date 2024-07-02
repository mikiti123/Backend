const mongoose = require("mongoose");

const KlientSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minLength: 6
    },
    haslo: 
    {
        type: String,
        required : true,
        minLength: 6
    },
    register_date: {
        type: Date,
        default:()=>Date.now()
    }    
});
module.exports = mongoose.model("Klient",KlientSchema);