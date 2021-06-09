const Sauce = require("../models/Sauce");

// "fs" systeme de fichiers donne accès aux fonctions qui nous permettent de modifier le système de fichiers, 
//y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');


//création de la sauce 
exports.createSauce = (req, res, next) => {                               
  //Création d'un objet réponse (constitué de "sauce" et de "image") qu'on met au format json
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
      userId: sauceObject.userId,
      name: sauceObject.name,
      manufacturer: sauceObject.manufacturer,
      description: sauceObject.description,
      //Expression dynamique pour recréer l'adresse url pour trouver le fichier téléchargé récupéré par multer
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      mainPepper: sauceObject.mainPepper,
      heat: sauceObject.heat,
     // likes: 0,
     // dislikes: 0, 
      //usersLiked: [],
      //usersDisliked: []
  });
  sauce.save()                                                               // La methode save renvoie une Promise donc : 
      .then(() => res.status(201).json({message: "Sauce enregistrée !"}))     // Dans le bloc Then nous renverrons une reponse de reussite code 201 
      .catch(error => res.status(400).json({error}));                         // ou une erreur code 400
};


// modifier la sauce
exports.modifySauce = (req, res, next) => {                                     // on export les fonctionSauce sauce des routes.
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),        // Operateur Spread "..." utilisé pour faire une copie de tout les elemts de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // On utilise le params.id de la requete pour reconfigurer notre sauce avec le meme ID qu'avant
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };


// effacer la sauce
  exports.deleteSauce = (req, res, next) => {                                     // on export les fonctionSauce sauce des routes.
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {                 //fs va etre utiliser pour supprimer des fichiers 
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

// Chercher une sauce
exports.getOneSauce =(req,res,next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
};


//Chercher toute les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };


// Like / Dislike sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })                               // On cherche la sauce en question par rapport a l'ID
      .then(sauce => {
          switch (req.body.like) {
              case -1:
                  sauce.dislikes = sauce.dislikes + 1;
                  sauce.usersDisliked.push(req.body.userId);
                  sauceObject = {
                      "dislikes": sauce.dislikes,
                      "usersDisliked": sauce.usersDisliked
                  }
                  break;
              case 0:
                  if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                      sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
                      sauce.dislikes = sauce.dislikes - 1;
                      sauceObject = {
                          "dislikes": sauce.dislikes,
                          "usersDisliked": sauce.usersDisliked
                      }
                  } else {
                      sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
                      sauce.likes = sauce.likes - 1;
                      sauceObject = {
                          "likes": sauce.likes,
                          "usersLiked": sauce.usersLiked
                      }
                  }
                  break;
              case +1:
                  sauce.likes = sauce.likes + 1;
                  sauce.usersLiked.push(req.body.userId);
                  sauceObject = {
                      "likes": sauce.likes,
                      "usersLiked": sauce.usersLiked
                  }
                  break;
              default:
                  return res.status(500).json({ error });
          }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: "Congrat's! La sauce est likée" }))
              .catch(error => res.status(400).json({ error }));
      })
      .catch(() => res.status(400).json({ error: "Damned ! Sauce non trouvée "}));
}