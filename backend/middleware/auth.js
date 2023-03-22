const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(2)
  // récupération du token dans le header authorization de la requête
  
    try{
        //vérification du token et récupération du userId du token (décodage)   
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'Random_TOKEN_SECRET');
        //récupération de l'id utilisateur du token 
        const userId = decodedToken.userId;
        //ajout de l'id utilisateur au corps de la requête pour l'utiliser dans les controllers 
        req.auth={
            userId: userId
        };
        next();
        //gestion des erreurs  (si le token n'est pas bon)
    }catch (error) {  
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};