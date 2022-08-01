const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
     id: {
          type: Number,
          required: [true, 'must provide id'],
          unique: true
     }
}); 

//arg0: name  arg1: schema
module.exports = mongoose.model('Favorite', FavoriteSchema);