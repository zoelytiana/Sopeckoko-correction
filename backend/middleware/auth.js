const jwt = require('jsonwebtoken'); // genere un token user

module.exports = (req, res, next) => {
  try {
    
    const token = req.headers.authorization.split(' ')[1];    //j'extrais le token du header AUTHORIZATION et la req entrante : "Bearer"+ Clef secrete 
                                                              // j'utilise la fonction Split pour récuperer tout après l'espace dans le Header 
    const decodedToken = jwt.verify(token, "JESUISSECRETE");  // Fonction verify pour décoder letoken 
    const userId = decodedToken.userId;                        //J'extrais l'user ID du Token
    if (req.body.userId && req.body.userId !== userId) {      // Si la demande contient un userID je le compare à l'extrait du token 
      throw "Damned! L'userID n'est pas valable !  ";         // Si different on genere une erreur 
    } else {                                                  
      next();                                                 // si tout est ok on passe a la fonction next()
    }
  } catch {                                                                 // les erreurs générés d'affichent dans le bloc catch
    res.status(401).json({
      error: new Error("Damned ! La requete n'est pas authentifiée!")
    });
  }
};  