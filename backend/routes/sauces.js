const express = require('express');
const router = express.Router();
// Importation du middleware pour l'authentification
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');

const multer = require('../middleware/multer-config');

//Requête POST pour poster une sauce
router.post('/', auth, multer, sauceCtrl.createSauce );
//Requête PUT pour modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Requête DELETE pour effacer une sauce 
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Requête GET pour chercher après une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Requête GET pour chercher après toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);
//Requête POST pour enregistrer un like/disklike
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports= router;