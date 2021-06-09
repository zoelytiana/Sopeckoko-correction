const express = require('express'); // on importe l'application express
const bodyParser = require('body-parser'); //Rend les données du corps de la requete exploitable , elle extrait des infos de notre objet JSON
const mongoose = require('mongoose'); // on importe mongoose pour se connecter au cluster MongoDB et faciliter les interactions avec celui ci 
const path = require('path');
const saucesRoutes = require('./routes/sauces');  
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://admin:admin@cluster0.ljicx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',   // connexion au cluster 
    {
        useNewUrlParser: true,                  //fourni une chaine de connexion valide en activant cette fonction
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Damned Connexion à MongoDB échouée !'));


const app = express(); // Création de  l'application express

// Ajout de headers, * user peut accéder à l'API depuis n'importe quelle origine, autorisation d'utiliser des en-tête sur l'objet requête et certaines méthodes (get, post etc)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');        //Permet d'acceder à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permet d'ajouter les headers aux requetes envoyée vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  // Permet d'envoyer des requetes avec les methodes GET POST PUT DELETE PATCH OPTIONS
    next();
});

app.use(bodyParser.json());// Va transformer le corps de la requête en objet JS utilisable
app.use('/images', express.static(path.join(__dirname, 'images')));  
app.use('/api/sauces', saucesRoutes); // Importation des routes depuis le fichier sauce.js du dossier routes
app.use('/api/auth', userRoutes); // Importation de la route depuis le fichier user.js du dossier routes




module.exports = app; // Exportation de la const app pour y accèder depuis les autres fichiers.