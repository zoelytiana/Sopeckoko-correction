const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Plugin qui va verifier si deux users ne partage pas la meme adresse mail 

const userSchema = mongoose.Schema({
  userId: {type: String, required: false},                  //on  ne requiert pas l’ID à l’inscription c’est MongoDB qui se chargera de lui attribuer un ID
  email: { type: String, required: true, unique: true },    //On a besoin d’une adresse mail , puis on s’assure qu’elle est unique.
  password: { type: String, required: true }                //on a besoin du password de l’user 
});

userSchema.plugin(uniqueValidator);                         // Le plugin verifie si l'email est unique 

module.exports = mongoose.model('User', userSchema);        // on exporte le schema 