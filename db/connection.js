const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.mongoURI).then(() => {
        console.log("MongoDB is connected successfully");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports =  connectDB;