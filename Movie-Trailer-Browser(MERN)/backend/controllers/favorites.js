const Favorite = require('../models/Favorite');
//getFavorites, addFavorite, removeFavorite
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({});
        res.status(200).json({favorites: favorites});
    } catch (error) {
        res.status(500).json({msg: error}); 
    }
};

const addFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.create(req.body);
        res.status(201).json( { favorite } );
    } catch (error) {
        res.status(500).json({msg: error});
    }
};   


const removeFavorite = async (req, res) => {
    try {
        const {id} = req.body;
        const favorite = await Favorite.findOneAndDelete({id : id});
        
        if (!favorite) {
            return res.status(404).json({msg: `no favorite with movie id : ${id}`}); //must return!
        }
        
        res.status(200).json({favorite});
        
    } catch (error) {
        res.status(500).json({msg: error}); //provided id has wrong syntax    
    }
    
} 



module.exports = {
    getFavorites, 
    addFavorite, 
    removeFavorite
}