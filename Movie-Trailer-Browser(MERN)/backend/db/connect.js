const mongoose = require('mongoose');

//this function returns promise
const connectDB = (url) => {
    return mongoose.connect(url, {useNewUrlParser: true})
}

module.exports = connectDB;