require('dotenv').config();

const mongoose = require("mongoose");

async function connect(){
    mongoose.connect(process.env.URI)
    .then(()=>{
        console.log("connection successfull")
    })
    .catch((error)=>{
        console.log(error)
    })
}

module.exports = connect;


