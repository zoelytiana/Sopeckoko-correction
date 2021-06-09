const mongoose = require('mongoose');
// Création d'un schema de données qui contient les champs souhaités pour chaque sauce 
// Elle indique Type , et le caractère obligatoire ou non. 
// On ne met pas de champs pour l'ID car il est généré directement par mongoose. 
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description : {type: String, required: true },
    manufacturer: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true },
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type : Number, default: 0},
    usersLiked: {type: Array, required: true, default: []},
    usersDisliked: {type: Array, required: true, default: []}, 
    
    
});

module.exports = mongoose.model('Sauce', sauceSchema); // On exporte le schema en tant que modele Mongoose le rendant disponible pour notre app Express