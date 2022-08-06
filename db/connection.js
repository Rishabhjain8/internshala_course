const express = require("express");
const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.mongoURI).then(() => {
        console.log("database connected");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports =  connectDB;