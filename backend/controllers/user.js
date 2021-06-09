const bcrypt = require('bcrypt');     //generateur de hashage des mots de passe
const jwt = require('jsonwebtoken');    // outil plugin generer des Token for User

const User = require('../models/User');

//FONCTION CREATE A USER
exports.signup = (req, res, next) => { 
  //On crypte le mot de passe 
  bcrypt.hash(req.body.password, 10)  //On appelle la fonction bcrypt dans notre mot de passe et on lui demande de le hashé 10x . 
      .then(hash => {
      //Création du new user
      const user = new User({         
          email: req.body.email,
          password: hash
      });
      //Enregistrement du new user dans la base de données
      user.save()
          .then(() => res.status(201).json({message : "Utilisateur créé !"}))
          .catch(error => res.status(400).json({error})); 
  })
  .catch(error => res.status(500).json({error})); 
};

exports.login = (req, res, next) => {
  //on recherche l'user grâce a son mail dans la DataBase
  User.findOne({email: req.body.email})
      .then(user => {
          if (!user) {                              // si l'email est different donc n'existe pas dans la DB on renvoie l'erreur 401
              return res.status(401).json({error: "Utilisateur non trouvé !"});
          }
      //Si je trouve le mail dans la DataBase, je compare le hash du nouveau mot de passe au hash de la DataBase
      bcrypt.compare(req.body.password, user.password)
          .then(valid => {
              if(!valid) {
                  return res.status(401).json({error: "Mot de passe incorrect !"});
              }
              res.status(200).json({
                  userId: user._id,
                  //Encodage d'un nouveau token
                  token: jwt.sign(
                      {userId : user._id},
                      "JESUISSECRETE",
                      {expiresIn: "24h"}
                  )
              });
          })
          .catch(error => res.status(500).json({error}));
      })
      .catch(error => res.status(500).json({error}));
};